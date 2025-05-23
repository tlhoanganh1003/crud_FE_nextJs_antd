import type { Metadata } from "next";
import 'antd/dist/reset.css';
import "./globals.css";
import { ReactNode } from "react";
import { ConfigProvider } from "antd";

export const metadata: Metadata = {
  title: "quản lý sinh viên",
  description: "hihi",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>
      <ConfigProvider>
          {children}
        </ConfigProvider>

      </body>
    </html>
  );
}
