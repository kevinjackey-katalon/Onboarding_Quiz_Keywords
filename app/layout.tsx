import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Katalon Studio — Keywords Reference Quiz",
  description: "Test your knowledge of Katalon Studio keywords across Web, API, Mobile and Desktop.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
