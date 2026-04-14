import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Katalon Studio — Keywords & Advanced Quiz",
  description: "Katalon Studio onboarding quiz covering Keywords, Advanced topics, and more.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
