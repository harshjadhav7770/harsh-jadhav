import Link from "next/link";
import { SKILLHUB_META } from "@/lib/constants";

export function PublicFooter({
  candidateName,
  professionalTitle,
  socialLinks = [],
  attribution,
}: {
  candidateName?: string;
  professionalTitle?: string;
  socialLinks?: any[];
  attribution?: any;
}) {
  const showCredit = attribution?.showBrandCredit ?? true;
  const brandText = attribution?.brandText || SKILLHUB_META.brandCredit;
  const authorText = attribution?.authorText || SKILLHUB_META.author;
  const websiteUrl = attribution?.websiteUrl || SKILLHUB_META.website;

  return (
    <footer className="border-t bg-card text-card-foreground mt-20">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b">
          {/* Column 1: Candidate Brand */}
          <div className="space-y-2">
            <h3 className="font-bold text-lg tracking-tight">{candidateName || "Professional Portfolio"}</h3>
            <p className="text-sm text-muted-foreground">{professionalTitle || "Full Stack & Analytics"}</p>
            <p className="text-xs text-muted-foreground pt-1">
              Dedicated to building modern, reliable digital systems with clean architecture.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Navigation
            </h4>
            <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
              <Link href="/about" className="hover:text-foreground transition-colors">About</Link>
              <Link href="/skills" className="hover:text-foreground transition-colors">Skills</Link>
              <Link href="/projects" className="hover:text-foreground transition-colors">Projects</Link>
              <Link href="/experience" className="hover:text-foreground transition-colors">Experience</Link>
              <Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link>
            </div>
          </div>

          {/* Column 3: Social Links */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Connect
            </h4>
            <div className="flex flex-wrap gap-2 text-xs">
              {socialLinks.filter((s) => s.isVisible).map((s) => (
                <a
                  key={s._id}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded-md border bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                >
                  {s.platform}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Attribution */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} {candidateName || "Candidate"}. All rights reserved.
          </p>

          {showCredit && (
            <p className="flex items-center gap-1.5">
              <span>{brandText}</span>
              <span>&bull;</span>
              <span>Author: {authorText}</span>
              <span>&bull;</span>
              <a
                href={websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="text-primary hover:underline font-medium"
              >
                SKILLHUB IT SOLUTION
              </a>
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
