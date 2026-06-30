/** @jsxImportSource @emotion/react */
"use client";

import { css } from "@emotion/react";
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
          {/* 로고 영역 */}
          <div css={logoArea}>
            <Image
              src="/logo/logo.png"
              alt="logo"
              width={67}
              height={67}
              style={{ objectFit: "contain", opacity: 0.5 }}
            />
          </div>

          {/* 기업 정보 영역 (data_contact 데이터 실시간 연동) */}
          <div css={infoContent}>
            <span>
              {data_contact.company} <Divider /> 대표자: {data_contact.representative}{" "}
              <Divider /> 사업자등록번호: {data_contact.brn}
            </span>
            <span>
              EMAIL: {data_contact.email} <Divider /> TEL: {data_contact.tel}{" "}
              <Divider /> FAX: {data_contact.fax}
            </span>
            <span>
              본사: {data_contact.headquarter}
              {data_contact.branches && data_contact.branches.length > 0 && (
                <>
                  <Divider /> 지사: {data_contact.branches[0]}
                </>
              )}
            </span>
          </div>
        </div>

        {/* 하단 저작권 영역 */}
        <div css={copyrightStyle}>{getCopyright()}</div>
      </div>
    </footer>
  );
}

// --- Styles ---

const footerStyle = css({
  width: "100%",
  backgroundColor: colors.black,
  color: colors.white,
  borderTop: `1px solid ${colors.gray[900]}`,
});

const containerStyle = css({
  maxWidth: "1400px",
  margin: "0 auto",
  padding: "40px 50px 25px 50px",
  display: "flex",
  flexDirection: "column",
  gap: "25px",
  "@media (max-width: 768px)": {
    padding: "30px 20px 20px 20px",
  },
});

const topSection = css({
  display: "flex",
  alignItems: "flex-start",
  gap: "40px",
  "@media (max-width: 768px)": {
    flexDirection: "column",
    gap: "20px",
  },
});

const logoArea = css({
  flexShrink: 0,
  marginTop: "2px",
});

const barStyle = css({
  display: "inline-block",
  margin: "0 12px",
  color: colors.gray[800],
  fontSize: "0.75rem",
  verticalAlign: "middle",
});

const infoContent = css({
  display: "flex",
  flexDirection: "column",
  gap: "6px",
  color: colors.gray[400],
  fontSize: "0.8rem",
  lineHeight: 1.5,
  "& span": {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
  },
});

const copyrightStyle = css({
  borderTop: `1px solid ${colors.gray[900]}`,
  paddingTop: "20px",
  fontSize: "0.75rem",
  color: colors.gray[600],
  letterSpacing: "0.05em",
});
