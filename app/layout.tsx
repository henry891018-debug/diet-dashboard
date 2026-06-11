import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Diet Dashboard",
  description: "選擇食材，即時計算營養總覽",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW">
      <body>{children}</body>
    </html>
  );
}
