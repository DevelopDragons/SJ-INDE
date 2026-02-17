/** @jsxImportSource @emotion/react */
"use client";

import { css } from "@emotion/react";
import Link from "next/link";
import { ReactNode } from "react";
import { colors } from "../../styles/colors"; // 경로를 프로젝트에 맞게 수정하세요

interface BlurredBgButtonProps {
  children: ReactNode;
  href: string;
  variant?: "primary" | "outline";
  className?: string;
}

export default function BlurredBgButton({
  children,
  href,
  variant = "outline", // 기본값을 outline으로 설정 (전달해주신 스타일)
  className,
}: BlurredBgButtonProps) {
  // 공통 및 조건부 스타일 정의
  const buttonStyle = css({
    display: "inline-flex",
    alignItems: "center",
    gap: "16px",
    padding: "16px 22px",
    fontSize: "14px",
    fontWeight: 500, // Pretendard Medium
    letterSpacing: "0.12em",
    textDecoration: "none",
    transition:
      "transform 220ms ease, border-color 220ms ease, background 220ms ease",
    cursor: "pointer",
    border: "1px solid rgba(255, 255, 255, 0.38)",
    color: colors.white,
    background: "rgba(0, 0, 0, 0.18)",
    backdropFilter: "blur(6px)",
    WebkitBackdropFilter: "blur(6px)", // Safari 대응

    "&:hover": {
      transform: "translateY(-2px)",
      borderColor: colors.white,
      background: "rgba(0, 0, 0, 0.3)",
    },

    "&:active": {
      transform: "translateY(0)",
    },

    // variant가 primary일 때의 스타일 확장 (필요시)
    ...(variant === "primary" && {
      background: colors.primary,
      borderColor: colors.primary,
      backdropFilter: "none",
      "&:hover": {
        background: colors.primaryHover,
        borderColor: colors.primaryHover,
      },
    }),
  });

  return (
    <div
      className={className}
      css={css({
        textAlign: "center",
        marginTop: "2rem",
      })}
    >
      <Link href={href} css={buttonStyle}>
        {children}
      </Link>
    </div>
  );
}
