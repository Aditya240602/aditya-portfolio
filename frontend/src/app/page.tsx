import { existsSync } from "node:fs";
import path from "node:path";
import Portfolio from "@/components/portfolio";
import { site } from "@/data/site";

export default function Page() {
  // Evaluated at build time: the resume button only activates if the file exists.
  const resumeHref = existsSync(path.join(process.cwd(), "public", "resume.pdf")) ? site.resume.publicPath : null;
  return <Portfolio resumeHref={resumeHref} year={new Date().getFullYear()} />;
}
