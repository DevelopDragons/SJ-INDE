import type { Metadata } from "next";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "선준아이디 | SJ INDE",
  description:
    "최고의 전문성, 기술력을 바탕으로 가치있는 공간을 창조하는 신뢰받는 기업",
  keywords: "선준아이디, SJ INDE, 인테리어, 공간디자인, 시공",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      {/* <head>와 내부 <link> 태그는 globals.css에서 처리하므로 삭제했습니다. */}
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
