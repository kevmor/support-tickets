import type { Metadata } from "next";
import ThemeToggle from "./components/ThemeToggle";
import NavSidebar from "./components/NavSidebar";
import { Mada } from "next/font/google";
import "./globals.css";
import HelpRequestButton from "./components/HelpRequestButton";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";

const mada = Mada({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tickets",
  description: "Ticket management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("font-sans", mada.variable)}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme') || 'system';
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (theme === 'dark' || (theme === 'system' && prefersDark)) {
                    document.documentElement.classList.add('dark');
                  }
                  if (theme === 'light' || theme === 'dark') {
                    document.documentElement.setAttribute('data-theme', theme);
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="bg-background text-foreground antialiased">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-zinc-200 bg-white/80 px-3 py-2 backdrop-blur dark:border-zinc-800 dark:bg-zinc-100/10">
          <div className="flex items-center gap-2">
            <NavSidebar />
            <span className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              Support Tickets
            </span>
          </div>
          <div className="flex items-center gap-2">
            <HelpRequestButton />
            <ThemeToggle />
          </div>
        </header>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
