/** @jsxImportSource @emotion/react */
"use client";

import { colors } from "@/src/styles/colors";
import { css } from "@emotion/react";

interface ContactInfoProps {
  label: string;
  value: string | string[];
  href?: string;
}

export default function ContactInfo({ label, value, href }: ContactInfoProps) {
  const finalHref =
    !href && typeof value === "string" && value.includes("@")
      ? `mailto:${value}`
      : href;

  return (
    <div
      css={css({
        display: "flex",
        gap: 20,
        marginBottom: 12,
        fontSize: "1.1rem",
        alignItems: "flex-start",
      })}
    >
      <span
        css={css({ width: 150, fontWeight: 400, opacity: 0.75, flexShrink: 0 })}
      >
        {label}
      </span>

      <div
        css={css({
          display: "flex",
          flexDirection: "column",
          gap: 8,
          color: colors.white,
          fontWeight: 600,
        })}
      >
        {Array.isArray(value) ? (
          value.map((v, i) => <span key={i}>{v}</span>) // "본사 * 주소" 형태로 들어올 예정
        ) : finalHref ? (
          <a
            href={finalHref}
            css={css({
              textDecoration: "underline",
              textUnderlineOffset: 4,
              "&:hover": { opacity: 0.85 },
            })}
          >
            {value}
          </a>
        ) : (
          <span>{value}</span>
        )}
      </div>
    </div>
  );
}
