/** @jsxImportSource @emotion/react */
"use client";

import { useState, useEffect, use } from "react";
import { css } from "@emotion/react";
import Image from "next/image";
import { colors } from "@/src/styles/colors";

interface ProjectDetail {
  id: number;
  title: string;
  subTitle: string;
  saveNames: string | null;
  createdAt: string;
}

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 제공해주신 원본 규격 (4:3 비율)
  const ORIGIN_WIDTH = 1444; 
  const ORIGIN_HEIGHT = 1083;

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await fetch(`/api/projects/${id}`);
        if (!res.ok) throw new Error("데이터 로드 실패");
        const data = await res.json();
        setProject(data);
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (isLoading) return <div css={loadingContainerStyle}><div css={spinnerStyle} /></div>;
  if (!project) return <div css={loadingContainerStyle}>프로젝트를 찾을 수 없습니다.</div>;

  // 이미지 배열 처리
  const allImages = project.saveNames ? project.saveNames.split(",") : [];
  const firstImage = allImages[0]; // 첫 번째 대형 사진
  const remainingImages = allImages.slice(1); // 나머지 사진들

  return (
    <main css={detailContainerStyle}>
      {/* 상단 타이틀 */}
      <header css={headerInfoStyle}>
        <h1 css={mainTitleStyle}>{project.title}</h1>
        <p css={subTitleStyle}>{project.subTitle}</p>
        <div css={dividerStyle} />
      </header>

      {/* 갤러리 영역: 1 + 3열 구조 */}
      <section css={gallerySectionStyle}>
        {/* 1. 상단: 첫 번째 사진 대형 배치 */}
        <div css={mainHeroImageBox}>
          <Image
            src={`/uploads/${firstImage}`}
            alt="Main Hero"
            width={ORIGIN_WIDTH}
            height={ORIGIN_HEIGHT}
            css={imageStaticStyle} // 원본 비율 보존 및 가로 100%
            priority
          />
        </div>

        {/* 2. 하단: 나머지 사진 3열 그리드 배치 */}
        {remainingImages.length > 0 && (
          <div css={subImageGridStyle}>
            {remainingImages.map((img, idx) => (
              <div key={idx} css={gridItemStyle}>
                <Image
                  src={`/uploads/${img}`}
                  alt={`Detail ${idx}`}
                  width={ORIGIN_WIDTH}
                  height={ORIGIN_HEIGHT}
                  css={imageStaticStyle}
                />
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

// --- 스타일 정의 (시원하고 정갈한 레이아웃) ---

const detailContainerStyle = css({
  maxWidth: "1440px",
  margin: "0 auto",
  padding: "180px 40px 150px 40px",
  backgroundColor: colors.white,
  "@media (max-width: 768px)": {
    padding: "120px 20px 80px 20px",
  },
});

const headerInfoStyle = css({
  textAlign: "center",
  marginBottom: "80px",
});

const mainTitleStyle = css({
  fontSize: "3.2rem", // 글자 크기를 살짝 키움
  fontWeight: 700,
  color: colors.gray[700],
  letterSpacing: "-0.04em",
  marginBottom: "18px",
  "@media (max-width: 768px)": { fontSize: "2.4rem" },
});

const subTitleStyle = css({
  fontSize: "1.1rem",
  color: colors.gray[500],
  fontWeight: 300,
  marginBottom: "40px",
});

const dividerStyle = css({
  width: "35px",
  height: "1px",
  backgroundColor: colors.black,
  margin: "0 auto",
});

/* 이미지 원본 비율 보존 및 반응형 스타일 */
const imageStaticStyle = css({
  width: "100%", 
  height: "auto", // 가로폭에 맞춰 세로 비율 자동 계산 (4:3 보존)
  display: "block",
});

const gallerySectionStyle = css({
  display: "flex",
  flexDirection: "column",
  gap: "40px", // 메인과 하단 그리드 사이 간격
});

/* 상단 대형 이미지 (1) */
const mainHeroImageBox = css({
  position: "relative",
  width: "100%",
  backgroundColor: colors.gray[100],
  overflow: "hidden",
});

/* 하단 서브 그리드 (3열) */
const subImageGridStyle = css({
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)", // 데스크탑 3열
  gap: "30px", // 사진들 사이 간격
  "@media (max-width: 1024px)": {
    gridTemplateColumns: "repeat(2, 1fr)", // 태블릿 2열
  },
  "@media (max-width: 600px)": {
    gridTemplateColumns: "1fr", // 모바일 1열
  },
});

const gridItemStyle = css({
  position: "relative",
  backgroundColor: colors.gray[100],
  overflow: "hidden",
});

// 로딩 스타일 (변동 없음)
const loadingContainerStyle = css({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
});

const spinnerStyle = css({
  width: "30px",
  height: "30px",
  border: `2px solid ${colors.gray[200]}`,
  borderTop: `2px solid ${colors.black}`,
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
  "@keyframes spin": {
    "0%": { transform: "rotate(0deg)" },
    "100%": { transform: "rotate(360deg)" },
  }
});