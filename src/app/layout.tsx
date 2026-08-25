import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CyberHub — Cybersecurity Faculty ERP",
  description: "Cybersecurity Faculty Event & Activity Management Portal for department faculties.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
