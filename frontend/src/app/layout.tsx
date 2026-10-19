import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/jetbrains-mono";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "./globals.css";
import { site, socials, isSet } from "@/data/site";
import { Analytics } from "@vercel/analytics/next";

const title = `${site.name} — Software Developer & Competitive Programmer`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: title, template: `%s · ${site.name}` },
  description: site.description,
  keywords: [
    "Aditya Kumar",
    "NSUT",
    "software developer",
    "competitive programming",
    "backend engineering",
    "Node.js",
    "C++",
    "portfolio",
  ],
  authors: [{ name: site.name }],
  creator: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    title,
    description: site.description,
    siteName: site.name,
    locale: "en_IN",
    url: "/",
  },
  twitter: { card: "summary", title, description: site.description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f5f1" },
    { media: "(prefers-color-scheme: dark)", color: "#111110" },
  ],
};

// Runs before first paint so there is no light/dark flash.
const themeScript = `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':matchMedia('(prefers-color-scheme: dark)').matches;var r=document.documentElement;r.classList.toggle('dark',d);}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    jobTitle: "Computer Science Student & Software Developer",
    email: `mailto:${site.email}`,
    address: { "@type": "PostalAddress", addressLocality: "East Delhi", addressCountry: "IN" },
    alumniOf: { "@type": "CollegeOrUniversity", name: "Netaji Subhas University of Technology" },
    knowsAbout: ["Data structures and algorithms", "Backend engineering", "REST APIs", "Competitive programming"],
    sameAs: socials.filter((s) => isSet(s.url)).map((s) => s.url),
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>
        {children}
        <Analytics />
        <noscript>
          <style>{".ssr-pending{opacity:1!important}"}</style>
        </noscript>
      </body>
    </html>
  );
}
