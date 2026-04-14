import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Katalon Studio — Keywords Reference Quiz",
  description: "Test your knowledge of Katalon Studio keywords across Web, API, Mobile and Desktop.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
