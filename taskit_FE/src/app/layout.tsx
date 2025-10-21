import "./globals.css";
import { QueryProvider } from "../providers/QueryProvider";
import Script from "next/script";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          {children}
          <Script
            src="https://accounts.google.com/gsi/client"
            strategy="afterInteractive"
          />
        </QueryProvider>
      </body>
    </html>
  );
}
