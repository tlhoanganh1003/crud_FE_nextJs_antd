import type { Metadata } from "next";
import 'antd/dist/reset.css';
import "./globals.css";
import { ReactNode } from "react";
import { ConfigProvider } from "antd";
import Script from 'next/script'; // 💡 THÊM DÒNG NÀY
import 'mathlive/static.css';

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
      <head>
        {/* 👉 Đặt Script ở head để MathJax tải sớm */}
        <Script
          id="mathjax-script"
          async
          src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"
        />
      </head>
      <body>
        <ConfigProvider>
          {children}
        </ConfigProvider>
      </body>
    </html>
  );
}
