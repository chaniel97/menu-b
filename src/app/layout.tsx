import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Her Kitchen 💕",
  description: "A personal menu app for the dishes I love",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#fdf8f3]">
        <div className="min-h-dvh mx-auto max-w-app w-full">
          {children}
        </div>
      </body>
    </html>
  );
}
