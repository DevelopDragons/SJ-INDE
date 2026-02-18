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
        // 부모 컨테이너 내부에서 해당 요소로 정확히 이동
        targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }

      // 애니메이션 대기 시간 (스크롤 속도에 맞춰 조절)
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
        // 아래로
        if (current < sectionIds.length - 1) scrollToSection(current + 1);
      } else if (e.deltaY < -50) {
        // 위로
        if (current > 0) scrollToSection(current - 1);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [scrollToSection, sectionIds.length]);

  return (
    <>
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
      <div css={pageContainerStyle}>
        {/* 사이드 내비게이션 - activeIdx 상태에 따라 즉각 반응 */}
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

        <main css={mainWrapperStyle}>
          {data_main.map((sec) => (
            <BasicSection
              key={sec.id}
              sec={sec}
              // 마우스 클릭 시 다음 섹션 이동을 위해 index 전달 (선택사항)
              onNext={() => scrollToSection(activeIdxRef.current + 1)}
              sectionRef={() => {}}
            />
          ))}

          {/* 컨택트 섹션 id="contact"가 내부 <section>에 반드시 있어야 함 */}
          <ContactSection sectionRef={() => {}} />
        </main>
      </div>
    </>
  );
}

const pageContainerStyle = css({
  height: "100vh",
  width: "100%",
  position: "relative",
  overflow: "hidden", // 내부 mainWrapper에서만 움직이도록 설정
});

const mainWrapperStyle = css({
  height: "100%",
  width: "100%",
});

// asideStyle, navLinkStyle은 기존과 동일하되 z-index 확인
const asideStyle = css({
  position: "fixed",
  right: "40px",
  top: "50%",
  transform: "translateY(-50%)",
  zIndex: 1000, // 최상단 유지
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
