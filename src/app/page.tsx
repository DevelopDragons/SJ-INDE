/** @jsxImportSource @emotion/react */
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { css, Global } from "@emotion/react";
import { data_main } from "../../public/data/main";
import BasicSection from "../components/main/BasicSection";
import ContactSection from "../components/main/ContactSection";

export default function HomePage() {
  const [activeIdx, setActiveIdx] = useState(0);
  const isScrolling = useRef(false);
  const activeIdxRef = useRef(0); // 실시간 인덱스 참조용

  const sectionIds = [...data_main.map((d) => d.id), "contact"];

  useEffect(() => {
    // 1. 메인 페이지 진입 시 스크롤 차단
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.height = "100%";

    return () => {
      // 2. 다른 페이지로 이동(Unmount) 시 스크롤 복구
      document.documentElement.style.overflow = "auto";
      document.body.style.overflow = "auto";
      document.body.style.height = "auto";
    };
  }, []);

  // 인덱스 이동 함수
  const scrollToSection = useCallback(
    (index: number) => {
      if (index < 0 || index >= sectionIds.length || isScrolling.current)
        return;

      isScrolling.current = true;
      setActiveIdx(index);
      activeIdxRef.current = index; // Ref 업데이트

      const targetId = sectionIds[index];
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }

      setTimeout(() => {
        isScrolling.current = false;
      }, 800);
    },
    [sectionIds],
  );

  // 휠 이벤트 핸들러
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.cancelable) e.preventDefault();
      if (isScrolling.current) return;

      const current = activeIdxRef.current;

      if (e.deltaY > 50) {
        if (current < sectionIds.length - 1) scrollToSection(current + 1);
      } else if (e.deltaY < -50) {
        if (current > 0) scrollToSection(current - 1);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [scrollToSection, sectionIds.length]);

  return (
    // 💡 1. 최상단에 .is-main-page를 주어 RootLayout이 감지하도록 하고, pageContainerStyle을 한 번만 먹입니다.
    <div className="is-main-page" css={pageContainerStyle}>
      <Global
        styles={css`
          html,
          body {
            margin: 0;
            padding: 0;
            overflow: hidden; /* 전체 브라우저 스크롤 차단 */
            height: 100%;
          }
        `}
      />

      {/* 사이드 내비게이션 */}
      <aside css={asideStyle}>
        {sectionIds.map((id, index) => (
          <a
            key={id}
            href={`#${id}`}
            css={navLinkStyle(activeIdx === index)}
            onClick={(e) => {
              e.preventDefault();
              scrollToSection(index);
            }}
          >
            {id.toUpperCase()}
          </a>
        ))}
      </aside>

      {/* 💡 2. 기존 중복 <main> 태그와 불필요한 중복 래퍼 div를 걷어내고 하나로 통합했습니다. */}
      <div css={mainWrapperStyle}>
        {data_main.map((sec) => (
          <BasicSection
            key={sec.id}
            sec={sec}
            onNext={() => scrollToSection(activeIdxRef.current + 1)}
            sectionRef={() => {}}
          />
        ))}

        {/* 컨택트 섹션 */}
        <ContactSection sectionRef={() => {}} />
      </div>
    </div>
  );
}

// --- Styles ---
const pageContainerStyle = css({
  height: "100vh",
  width: "100%",
  position: "relative",
  overflow: "hidden",
});

const mainWrapperStyle = css({
  height: "100%",
  width: "100%",
});

const asideStyle = css({
  position: "fixed",
  right: "40px",
  top: "50%",
  transform: "translateY(-50%)",
  zIndex: 1000,
  display: "flex",
  flexDirection: "column",
  gap: "1.5rem",
  "@media (max-width: 768px)": { display: "none" },
});

const navLinkStyle = (isActive: boolean) =>
  css({
    fontSize: "0.7rem",
    textDecoration: "none",
    color: isActive ? "#fff" : "rgba(255,255,255,0.4)",
    fontWeight: isActive ? "bold" : "normal",
    transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
    textAlign: "right",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    "&::after": {
      content: '""',
      display: "inline-block",
      width: isActive ? "30px" : "0px",
      height: "1px",
      background: "white",
      marginLeft: "10px",
      transition: "all 0.4s ease",
    },
  });
