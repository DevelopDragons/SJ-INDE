/** @jsxImportSource @emotion/react */
"use client";

import { css } from "@emotion/react";
import Link from "next/link";
import { colors } from "../styles/colors";
import { getCopyright } from "../utils/str";
import Image from "next/image";
import { data_contact } from "@/public/data/contact";

export default function Footer() {
  const Divider = () => <span css={barStyle}>|</span>;

  return (
    <footer css={footerStyle}>
      <div css={containerStyle}>
        <div css={topSection}>
          {/* 기업 정보 영역 */}
          <div css={css({ display: "flex", flexDirection: "column", gap: 25 })}>
            <Image
              src="/logo/logo.png"
              alt="logo"
              width={80} // 가독성을 위해 살짝 키움
              height={80}
              style={{ objectFit: "contain", opacity: 0.8 }}
            />

            <div css={infoContent}>
              <span>
                선준아이디 <Divider /> 대표자: 홍길동 <Divider />{" "}
                사업자등록번호: 123-45-67890
              </span>
              <span>
                이메일: {data_contact.email} <Divider /> TEL: {data_contact.tel}{" "}
                <Divider /> FAX: {data_contact.fax}
              </span>
              <span>본사: {data_contact.headquarter}</span>
              {data_contact.branches && data_contact.branches.length > 0 && (
                <span>지사: {data_contact.branches[0]}</span>
              )}
            </div>
          </div>

          {/* 바로가기 메뉴 */}
          <nav css={linkGroup}>
            <Link href="/company/about">COMPANY</Link>
            <Link href="/business/work">BUSINESS</Link>
            <Link href="/projects">PROJECTS</Link>
            <Link href="/contact">CONTACT</Link>
          </nav>
        </div>

        {/* 하단 저작권 영역 */}
        <div
          css={css({
            borderTop: `1px solid ${colors.gray[800]}`,
            paddingTop: "30px",
            fontSize: "0.8rem",
            color: colors.gray[600],
            letterSpacing: "0.05em",
          })}
        >
          {getCopyright()}
        </div>
      </div>
    </footer>
  );
}

const footerStyle = css({
  width: "100%",
  backgroundColor: colors.black,
  color: colors.white,
  borderTop: `1px solid ${colors.gray[900]}`, // 더 은은한 구분선
});

const containerStyle = css({
  maxWidth: "1400px", // 너무 퍼지지 않게 가이드라인 설정
  margin: "0 auto",
  padding: "60px 50px 30px 50px",
  display: "flex",
  flexDirection: "column",
  gap: "40px",
  "@media (max-width: 768px)": {
    padding: "40px 20px",
  },
});

const topSection = css({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  flexWrap: "wrap",
  gap: "40px",
});

// "|" 구분선 스타일 최적화
const barStyle = css({
  display: "inline-block",
  margin: "0 15px", // 요청하신 수평 마진 확대
  color: colors.gray[700],
  fontSize: "0.8rem",
  verticalAlign: "middle",
});

const infoContent = css({
  display: "flex",
  flexDirection: "column",
  gap: "10px", // 줄 간격 확대
  color: colors.gray[400],
  fontSize: "0.85rem",
  lineHeight: 1.4,
  "& span": {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
  },
});

const linkGroup = css({
  display: "flex",
  gap: "30px",
  "& a": {
    fontSize: "0.95rem",
    fontWeight: 500,
    color: colors.gray[300],
    textDecoration: "none",
    transition: "color 0.2s ease",
    "&:hover": {
      color: colors.primary, // 호버 시 브랜드 컬러 사용
    },
  },
  "@media (max-width: 480px)": {
    gap: "15px",
    fontSize: "0.8rem",
  },
});
