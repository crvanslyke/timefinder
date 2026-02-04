import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TimeFinder - Meeting Scheduler",
  description: "Find the perfect time for your meetings",
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
