/** @jsxImportSource @emotion/react */
"use client";

import { css } from "@emotion/react";
import Image from "next/image";
import Link from "next/link";
import { colors } from "@/src/styles/colors";

export default function ProjectListCard({ project }: { project: any }) {
  const thumbnail = project.saveNames ? project.saveNames.split(",")[0] : null;
  const imageUrl = thumbnail ? `/uploads/${thumbnail}` : "/images/no-image.jpg";

  return (
    <Link href={`/projects/${project.id}`} css={cardWrapperStyle}>
      <div css={imageBoxStyle}>
        <Image
          src={imageUrl}
          alt={project.title}
          fill
          style={{ objectFit: "cover" }}
          css={imageTransitionStyle}
        />
        {/* 에러가 발생했던 부분: 하단에 스타일 정의를 추가했습니다 */}
        <div css={hoverOverlayStyle} />
      </div>

      <div css={infoBoxStyle}>
        <h3 css={mainTitleStyle}>{project.title}</h3>
        <p css={subTitleStyle}>{project.subTitle}</p>
      </div>
    </Link>
  );
}

const cardWrapperStyle = css({
  textDecoration: "none",
  display: "block",
  // 마우스 호버 시 이미지와 오버레이 반응
  "&:hover img": {
    transform: "scale(1.05)",
  },
  "&:hover .overlay": {
    opacity: 1,
  },
});

const imageBoxStyle = css({
  position: "relative",
  // 가로형 비율: 16:9 (더 와이드하게) 또는 3:2 (안정적인 가로형)
  aspectRatio: "16 / 9", 
  overflow: "hidden",
  backgroundColor: colors.gray[100],
  marginBottom: "18px",
});

const imageTransitionStyle = css({
  transition: "transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
});

// 에러 해결: hoverOverlayStyle 변수 정의
const hoverOverlayStyle = css({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.05)", // 아주 은은하게 어두워짐
  opacity: 0,
  transition: "opacity 0.4s ease",
  pointerEvents: "none", // 클릭 방해 금지
  zIndex: 1,
  // 부모(cardWrapperStyle)의 hover 상태에 반응하도록 클래스 부여 시 편리함
  ".group:hover &": {
    opacity: 1,
  },
});

const infoBoxStyle = css({
  display: "flex",
  flexDirection: "column",
  gap: "4px",
});

const mainTitleStyle = css({
  fontSize: "1.15rem",
  fontWeight: 600,
  color: colors.black,
  lineHeight: 1.4,
  letterSpacing: "-0.01em",
});

const subTitleStyle = css({
  fontSize: "0.85rem",
  color: colors.gray[600],
  fontWeight: 300,
});