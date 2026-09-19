import "./globals.css";
import { QueryProvider } from "../providers/QueryProvider";
import Script from "next/script";
import { Toaster } from "@/components/ui/sonner";

const themeInitScript = `
(function() {
  try {
    var stored = localStorage.getItem('theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var dark = stored ? stored === 'dark' : prefersDark;
    document.documentElement.classList.toggle('dark', dark);
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <QueryProvider>
          {children}
          <Toaster richColors position="top-right" />
          <Script
            src="https://accounts.google.com/gsi/client"
            strategy="afterInteractive"
          />
        </QueryProvider>
      </body>
    </html>
  );
}
