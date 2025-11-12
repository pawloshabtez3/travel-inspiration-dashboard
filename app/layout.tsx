import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import EnvValidator from "@/components/EnvValidator";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Travel Inspiration Dashboard",
  description: "Find your next destination by mood",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <EnvValidator />
        <Header />
        {children}
      </body>
    </html>
  );
}
