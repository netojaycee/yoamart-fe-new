import type { Metadata } from "next";
import "./globals.css";
import ReduxProvider from "@/lib/ReduxProvider";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Yoamart Supermarket",
  description: "Grocery store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <ReduxProvider>{children}</ReduxProvider> <Toaster richColors closeButton />
      </body>
    </html>
  );
}
