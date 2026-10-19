require('dotenv').config();
const crypto = require('crypto');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { z } = require('zod');

const { PORT = 3000, MONGODB_URI, ALLOWED_ORIGINS = '', ADMIN_TOKEN } = process.env;
if (!MONGODB_URI) { console.error('MONGODB_URI is required'); process.exit(1); }

/* ---------- models ---------- */
const Note = mongoose.model('Note', new mongoose.Schema({
  name: { type: String, required: true, maxlength: 40 },
  message: { type: String, required: true, maxlength: 280 },
}, { timestamps: { createdAt: true, updatedAt: false } }));

const Contact = mongoose.model('Contact', new mongoose.Schema({
  name: { type: String, required: true, maxlength: 80 },
  email: { type: String, required: true, maxlength: 120 },
  message: { type: String, required: true, maxlength: 2000 },
}, { timestamps: { createdAt: true, updatedAt: false } }));

/* ---------- validation ---------- */
const noteSchema = z.object({
  name: z.string().trim().max(40).optional().transform(v => v || 'Anonymous'),
  message: z.string().trim().min(1).max(280),
  website: z.string().max(0).optional(), // honeypot: real users never fill this
});
const contactSchema = z.object({
  name: z.string().trim().min(1).max(80),
  email: z.string().trim().email().max(120),
  message: z.string().trim().min(5).max(2000),
  website: z.string().max(0).optional(),
});

/* ---------- app ---------- */
const app = express();
app.set('trust proxy', 1);
app.use(helmet());
const origins = ALLOWED_ORIGINS.split(',').map(s => s.trim()).filter(Boolean);
app.use(cors({ origin: origins.length ? origins : false, methods: ['GET', 'POST', 'DELETE'] }));
app.use(express.json({ limit: '10kb' }));

const readLimit = rateLimit({ windowMs: 60_000, limit: 120, standardHeaders: true, legacyHeaders: false });
const writeLimit = rateLimit({ windowMs: 10 * 60_000, limit: 5, standardHeaders: true, legacyHeaders: false,
  message: { error: 'Too many submissions, try again in a few minutes.' } });

const safeEq = (a, b) => {
  const x = Buffer.from(a || ''), y = Buffer.from(b || '');
  return x.length === y.length && crypto.timingSafeEqual(x, y);
};
const admin = (req, res, next) =>
  ADMIN_TOKEN && safeEq(req.get('x-admin-token'), ADMIN_TOKEN) ? next() : res.status(401).json({ error: 'Unauthorized' });

/* self-invalidating cache: reads hit memory, any write clears it */
let cache = null;
const bust = () => { cache = null; };

app.get('/api/health', (_req, res) =>
  res.json({ ok: true, db: mongoose.connection.readyState === 1 }));

app.get('/api/guestbook', readLimit, async (_req, res, next) => {
  try {
    if (!cache) {
      const docs = await Note.find().sort({ createdAt: -1 }).limit(30).select('name message createdAt').lean();
      cache = docs.map(d => ({ id: d._id, name: d.name, message: d.message, createdAt: d.createdAt }));
    }
    res.set('Cache-Control', 'public, max-age=10').json(cache);
  } catch (e) { next(e); }
});

app.post('/api/guestbook', writeLimit, async (req, res, next) => {
  try {
    const p = noteSchema.safeParse(req.body);
    if (!p.success) return res.status(400).json({ error: 'Invalid input', details: p.error.flatten().fieldErrors });
    if (p.data.website) return res.status(201).json({ ok: true }); // bot: pretend success
    const note = await Note.create({ name: p.data.name, message: p.data.message });
    bust();
    res.status(201).json({ id: note._id, name: note.name, message: note.message, createdAt: note.createdAt });
  } catch (e) { next(e); }
});

app.delete('/api/guestbook/:id', admin, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ error: 'Bad id' });
    const r = await Note.findByIdAndDelete(req.params.id);
    bust();
    res.status(r ? 200 : 404).json({ ok: !!r });
  } catch (e) { next(e); }
});

app.post('/api/contact', writeLimit, async (req, res, next) => {
  try {
    const p = contactSchema.safeParse(req.body);
    if (!p.success) return res.status(400).json({ error: 'Invalid input', details: p.error.flatten().fieldErrors });
    if (p.data.website) return res.status(201).json({ ok: true });
    await Contact.create({ name: p.data.name, email: p.data.email, message: p.data.message });
    res.status(201).json({ ok: true });
  } catch (e) { next(e); }
});

app.get('/api/contact', admin, async (_req, res, next) => {
  try { res.json(await Contact.find().sort({ createdAt: -1 }).limit(100).lean()); } catch (e) { next(e); }
});

app.use((_req, res) => res.status(404).json({ error: 'Not found' }));
app.use((err, _req, res, _next) => { console.error(err); res.status(500).json({ error: 'Server error' }); });

mongoose.connect(MONGODB_URI)
  .then(() => app.listen(PORT, () => console.log(`API listening on :${PORT}`)))
  .catch(e => { console.error('Mongo connection failed:', e.message); process.exit(1); });
