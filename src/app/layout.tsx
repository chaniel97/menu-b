import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MenuB",
  description: "A personal food menu app",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover", // lets content reach iPhone notch edges
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#fdf8f3]">
        <div className="min-h-dvh mx-auto w-full max-w-lg">
          {children}
        </div>
      </body>
    </html>
  );
}
