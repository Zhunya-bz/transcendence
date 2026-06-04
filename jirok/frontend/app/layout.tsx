import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/lib/queryProvider";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter", // css variable
});

export const metadata: Metadata = {
  title: "Jirok",
  description: "Task manager",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryProvider>
      <Toaster position="bottom-right" reverseOrder={false} />
      <html
        lang="en"
        className={`${inter.variable}  h-full antialiased`}
      >
        <body className="min-h-screen flex flex-col bg-blue-50">{children}</body>
      </html>
    </QueryProvider>
  );
}
