// Build-time guard: fails if a phone-number-like string appears in any text file
// that ships with the site. Binary files (e.g. the resume PDF) can't be scanned
// reliably, so a reminder is printed instead.
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join, extname } from "node:path";

const roots = ["src", "public", "README.md", "package.json"];
const textExt = new Set([".ts", ".tsx", ".js", ".mjs", ".css", ".json", ".md", ".txt", ".svg", ".html", ".xml"]);
const phone = /(?:\+?\d{1,3}[\s.-]?)?(?:\(?\d{3,5}\)?[\s.-]?)\d{3,5}[\s.-]?\d{3,5}/g;

const hits = [];
const walk = (p) => {
  if (!existsSync(p)) return;
  if (statSync(p).isDirectory()) return readdirSync(p).forEach((f) => walk(join(p, f)));
  if (!textExt.has(extname(p))) return;
  const text = readFileSync(p, "utf8");
  for (const m of text.matchAll(phone)) {
    // only flag sequences with 10+ digits (years, ratings and ranges are shorter)
    if (m[0].replace(/\D/g, "").length >= 10) hits.push(`${p}: "${m[0].trim()}"`);
  }
};
roots.forEach(walk);

if (hits.length) {
  console.error("\n✖ Possible phone number found in site files:\n  " + hits.join("\n  "));
  process.exit(1);
}
console.log("✔ No phone-number patterns found in source or text assets.");
if (existsSync("public/resume.pdf")) {
  console.log("⚠ public/resume.pdf is bundled with the site. Open it and confirm it does not list a phone number.");
}
