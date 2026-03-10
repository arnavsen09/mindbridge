import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MindBridge - AI-Powered Mental Health Communication",
  description: "MindBridge helps teens express emotions freely while AI translates them into clear guidance for parents and counselors.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
