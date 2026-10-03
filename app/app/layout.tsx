import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aplikasi Nota Kasir Digital",
  description: "Aplikasi nota penjualan universal untuk UMKM dan semua kalangan",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="bg-gray-100 antialiased">{children}</body>
    </html>
  );
}
