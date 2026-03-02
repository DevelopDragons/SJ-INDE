/** @jsxImportSource @emotion/react */
"use client";

import { useState, useEffect } from "react";
import { css } from "@emotion/react";
import { colors } from "@/src/styles/colors";
// Header 임포트 제거 (layout.tsx에서 담당하므로)
import ProjectListCard from "@/src/components/project/ProjectListCard";

interface Project {
  id: number;
  title: string;
  subTitle: string;
  saveNames: string | null;
}

export default function ProjectPage() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((err) => console.error("Data Fetch Error:", err));
  }, []);

  return (
    <>
      {/* 1. 헤더 배경 레이어 제거함 */}
      {/* 2. <Header /> 호출 제거함 (layout.tsx에서 자동 적용됨) */}
      
      <main css={mainContainerStyle}>
        <div css={contentWrapperStyle}>
          <header css={pageHeaderStyle}>
            <h2 css={titleStyle}>PROJECTS</h2>
            <div css={titleLineStyle} />
            <p css={descriptionStyle}>
              선준아이디가 제안하는 프리미엄 공간 디자인 포트폴리오입니다.
            </p>
          </header>

          <div css={gridContainerStyle}>
            {projects.map((project) => (
              <ProjectListCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}

// --- 스타일 부분 ---

const mainContainerStyle = css({
  backgroundColor: colors.white,
  minHeight: "100vh",
  // Header의 높이가 90px이므로 본문 시작점은 160px~180px 정도가 적당합니다.
  paddingTop: "180px", 
  paddingBottom: "120px",
  "@media (max-width: 768px)": {
    paddingTop: "120px",
  },
});

const contentWrapperStyle = css({
  maxWidth: "1400px",
  margin: "0 auto",
  padding: "0 50px",
  "@media (max-width: 768px)": {
    padding: "0 20px",
  },
});

const pageHeaderStyle = css({
  marginBottom: "80px",
  textAlign: "left",
});

const titleStyle = css({
  fontSize: "2.5rem",
  fontWeight: 700,
  color: colors.black,
  letterSpacing: "-0.02em",
  marginBottom: "20px",
});

const titleLineStyle = css({
  width: "30px",
  height: "3px",
  backgroundColor: colors.black,
  marginBottom: "25px",
});

const descriptionStyle = css({
  fontSize: "1rem",
  color: colors.gray[600],
  fontWeight: 300,
});

const gridContainerStyle = css({
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "60px 40px",
  "@media (max-width: 1024px)": {
    gridTemplateColumns: "repeat(2, 1fr)",
  },
  "@media (max-width: 640px)": {
    gridTemplateColumns: "1fr",
  },
});