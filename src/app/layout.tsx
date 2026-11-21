import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { SKILLHUB_META } from "@/lib/constants";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | Professional Portfolio",
    default: "Professional Portfolio | Powered by SKILLHUB",
  },
  description:
    "Dynamic, high-performance personal portfolio built with SKILLHUB Dynamic Portfolio System.",
  authors: [{ name: SKILLHUB_META.author, url: SKILLHUB_META.website }],
  creator: SKILLHUB_META.organization,
  metadataBase: new URL(process.env.SKILLHUB_APP_URL || "http://localhost:3000"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
