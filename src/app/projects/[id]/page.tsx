/** @jsxImportSource @emotion/react */
"use client";

import { useState, useEffect, use } from "react";
import { css, keyframes } from "@emotion/react";
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
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animKey, setAnimKey] = useState(0);

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

  const allImages = project.saveNames ? project.saveNames.split(",") : [];

  const handleNext = () => {
    if (currentIndex >= allImages.length - 1) return;
    setCurrentIndex((prev) => prev + 1);
    setAnimKey((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentIndex <= 0) return;
    setCurrentIndex((prev) => prev - 1);
    setAnimKey((prev) => prev + 1);
  };

  // ✨ 추가: 마우스 우클릭 이벤트를 무력화하는 핸들러
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <main css={detailContainerStyle}>
      {/* 상단 타이틀 */}
      <header css={headerInfoStyle}>
        <h1 css={mainTitleStyle}>{project.title}</h1>
        <p css={subTitleStyle}>{project.subTitle}</p>
        <div css={dividerStyle} />
      </header>

      {/* 갤러리 캐러셀 영역 */}
      <section css={gallerySectionStyle}>
        {allImages.length > 0 ? (
          <>
            {/* 1. 첫 장/마지막 장 조건부 화살표 렌더링 */}
            {allImages.length > 1 && currentIndex > 0 && (
              <button css={[arrowButtonStyle, leftArrowStyle]} onClick={handlePrev} aria-label="Previous Image">
                <span css={[arrowIconStyle, leftChevron]} />
              </button>
            )}

            {allImages.length > 1 && currentIndex < allImages.length - 1 && (
              <button css={[arrowButtonStyle, rightArrowStyle]} onClick={handleNext} aria-label="Next Image">
                <span css={[arrowIconStyle, rightChevron]} />
              </button>
            )}

            {/* 2. 캐러셀 컨테이너 */}
            <div css={carouselWrapperStyle}>
              <div 
                css={sliderTrackStyle} 
                style={{ transform: `translateX(calc(-${currentIndex * 100}%))` }}
              >
                {allImages.map((img, idx) => {
                  const isCenter = idx === currentIndex;
                  return (
                    <div key={idx} css={slideItemStyle}>
                      {/* ✨ 우클릭 금지 핸들러(onContextMenu) 연동 */}
                      <div 
                        css={[imageWrapperStyle, !isCenter && sideImageStyle]}
                        onContextMenu={handleContextMenu}
                      >
                        <Image
                          key={isCenter ? `center-${animKey}` : `side-${idx}`}
                          src={`/uploads/${img}`}
                          alt={`Project Image ${idx + 1}`}
                          width={ORIGIN_WIDTH}
                          height={ORIGIN_HEIGHT}
                          css={[imageStaticStyle, isCenter && centerBlurAnimation]}
                          priority={isCenter}
                          draggable={false} // 이미지 드래그 다운로드 방지
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          <div css={noImageStyle}>등록된 이미지가 없습니다.</div>
        )}
      </section>
    </main>
  );
}

// --- 스타일 정의 및 애니메이션 ---

const blurFadeIn = keyframes`
  0% {
    filter: blur(8px);
    opacity: 0.8;
  }
  100% {
    filter: blur(0px);
    opacity: 1;
  }
`;

const detailContainerStyle = css({
  maxWidth: "100%", 
  margin: "0 auto",
  padding: "180px 0 150px 0",
  backgroundColor: colors.white,
  overflowX: "hidden", 
  "@media (max-width: 768px)": {
    padding: "120px 0 80px 0",
  },
});

const headerInfoStyle = css({
  textAlign: "center",
  marginBottom: "60px",
  padding: "0 20px",
});

const mainTitleStyle = css({
  fontSize: "3.2rem",
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

const gallerySectionStyle = css({
  width: "100%",
  position: "relative",
  maxWidth: "1440px", 
  margin: "0 auto",
});

const carouselWrapperStyle = css({
  position: "relative",
  width: "65%", 
  margin: "0 auto",
  overflow: "visible", 
  "@media (max-width: 1024px)": { width: "75%" },
  "@media (max-width: 768px)": { width: "80%" },
});

const sliderTrackStyle = css({
  display: "flex",
  width: "100%",
  transition: "transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)",
});

const slideItemStyle = css({
  minWidth: "100%",
  width: "100%",
  flexShrink: 0,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "0 24px", 
  boxSizing: "border-box",
});

/* ✨ 이미지 보호막 설정 스타일 변경 */
const imageWrapperStyle = css({
  width: "100%",
  backgroundColor: colors.gray[100],
  overflow: "hidden",
  borderRadius: "6px",
  transition: "all 0.4s ease",
  /* pointer-events를 none으로 주면 마우스 우클릭/모바일 롱탭 자체가 먹히지 않습니다 */
  pointerEvents: "none", 
  userSelect: "none",
});

const sideImageStyle = css({
  filter: "blur(2px)",
  opacity: 0.4,
  transform: "scale(0.97)",
});

const imageStaticStyle = css({
  width: "100%", 
  height: "auto", 
  display: "block",
});

const centerBlurAnimation = css({
  animation: `${blurFadeIn} 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`,
  willChange: "filter, opacity",
});

const arrowButtonStyle = css({
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  zIndex: 30, // 이미지 영역(pointer-events: none)보다 상위에 배치되어 안정적으로 클릭됨
  background: "none",
  border: "none",
  width: "60px",
  height: "60px",
  cursor: "pointer",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  transition: "transform 0.2s ease, opacity 0.2s ease",
  opacity: 0.4, 
  "&:hover": {
    opacity: 0.9,
    transform: "translateY(-50%) scale(1.1)", 
  },
  "@media (max-width: 1024px)": {
    width: "40px",
    height: "40px",
  },
});

const leftArrowStyle = css({ 
  left: "4%", 
  "@media (max-width: 768px)": { left: "1%" },
});

const rightArrowStyle = css({ 
  right: "4%", 
  "@media (max-width: 768px)": { right: "1%" },
});

const arrowIconStyle = css({
  display: "inline-block",
  width: "18px",
  height: "18px",
  borderTop: `2.5px solid ${colors.gray[800]}`, 
  borderRight: `2.5px solid ${colors.gray[800]}`,
  boxSizing: "border-box",
  "@media (max-width: 768px)": {
    width: "13px",
    height: "13px",
    borderWidth: "2px",
  },
});

const leftChevron = css({
  transform: "rotate(-135deg)",
});

const rightChevron = css({
  transform: "rotate(45deg)",
});

const noImageStyle = css({
  textAlign: "center",
  padding: "100px 0",
  color: colors.gray[400],
});

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