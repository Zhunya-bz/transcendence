"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { QueryProvider } from "@/lib/queryProvider";
import { Toaster } from "react-hot-toast";

console.error = () => { }
console.warn = () => { }

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <QueryProvider>
        {children}
        <Toaster position="bottom-right" reverseOrder={false} />
      </QueryProvider>
    </NextThemesProvider>
  );
}
