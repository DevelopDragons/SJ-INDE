import type { Metadata } from "next";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { colors } from "../styles/colors";

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
      <body>
        <Header />
        {/* 💡 main 태그에 스타일 속성 주입:
          - padding-top: 헤더가 fixed이기 때문에 컨텐츠가 가려지지 않도록 기본 헤더 높이만큼 확보 (데스크탑 90px 기준)
          - padding-bottom: 푸터와 컨텐츠가 너무 달라붙지 않도록 하단 컴포트 여백(120px) 추가
          - min-height: 컨텐츠 양이 적은 페이지에서도 푸터가 화면 맨 아래에 고정되도록 최소 높이 설정
        */}
        <main
          style={{
            paddingTop: "90px",
            // paddingBottom: "120px",
            minHeight: "calc(100vh - 90px)", // 화면 전체에서 헤더 높이를 뺀 만큼 최소 구역 확보
            boxSizing: "border-box",
            backgroundColor: colors.white,
          }}
        >
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
