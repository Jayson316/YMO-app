
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Young In Mind Organization | YMO",
  description: "Transforming overlooked children into leaders for Christ.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;0,900;1,700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
