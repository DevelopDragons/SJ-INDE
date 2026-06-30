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
  const activeIdxRef = useRef(0);

  // 모바일 환경 체크를 위한 상태값
  const [isMobile, setIsMobile] = useState(false);

  const sectionIds = [...data_main.map((d) => d.id), "contact"];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    // 💡 데스크탑뿐만 아니라 모바일에서도 스크롤 및 화면 움직임을 완벽 차단합니다.
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.height = "100%";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";

    // 모바일에서 스와이프/터치로 화면이 출렁이거나 당겨지는 현상(Bouncing) 원천 방지
    const handleTouchMove = (e: TouchEvent) => {
      if (window.innerWidth <= 768) {
        if (e.cancelable) e.preventDefault();
      }
    };
    window.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("touchmove", handleTouchMove);
      document.documentElement.style.overflow = "auto";
      document.body.style.overflow = "auto";
      document.body.style.height = "auto";
      document.body.style.position = "static";
      document.body.style.width = "auto";
    };
  }, []);

  const scrollToSection = useCallback(
    (index: number) => {
      // 💡 모바일일 때는 스크롤 이동 함수 자체를 무력화하여 무조건 첫 화면에 고정합니다.
      if (window.innerWidth <= 768) return;

      if (index < 0 || index >= sectionIds.length || isScrolling.current)
        return;

      isScrolling.current = true;
      setActiveIdx(index);
      activeIdxRef.current = index;

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

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (window.innerWidth <= 768) {
        // 💡 모바일 휠(패드 터치 등) 발생 시 브라우저 기본 스크롤 동작을 완전히 무시
        if (e.cancelable) e.preventDefault();
        return;
      }

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
    <div className="is-main-page" css={pageContainerStyle}>
      <Global
        styles={css`
          /* 💡 데스크탑, 모바일 공통으로 HTML/Body 단의 스크롤을 완전히 폐쇄합니다. */
          html,
          body {
            margin: 0;
            padding: 0;
            overflow: hidden !important;
            height: 100% !important;
          }

          @media (max-width: 768px) {
            /* 모바일에서 CLICK TO EXPLORE 컴포넌트가 렌더링되더라도 강제로 숨김 */
            section > div:last-child {
              opacity: 0 !important;
              display: none !important;
              pointer-events: none !important;
            }
          }
        `}
      />

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

      <div css={mainWrapperStyle}>
        {/* 💡 모바일일 때는 오직 첫 번째 섹션(main)만 렌더링하여 하단 요소가 걸치거나 노출되지 않도록 잠금 처리합니다. */}
        {isMobile ? (
          data_main
            .slice(0, 1)
            .map((sec) => (
              <BasicSection
                key={sec.id}
                sec={sec}
                onNext={() => {}}
                sectionRef={() => {}}
              />
            ))
        ) : (
          <>
            {data_main.map((sec) => (
              <BasicSection
                key={sec.id}
                sec={sec}
                onNext={() => {
                  if (window.innerWidth > 768) {
                    scrollToSection(activeIdxRef.current + 1);
                  }
                }}
                sectionRef={() => {}}
              />
            ))}
            <ContactSection sectionRef={() => {}} />
          </>
        )}
      </div>
    </div>
  );
}

const pageContainerStyle = css`
  height: 100vh;
  width: 100%;
  position: relative;
  overflow: hidden !important; /* 모바일에서도 오버플로우 차단 */
`;

const mainWrapperStyle = css`
  height: 100%;
  width: 100%;
  overflow: hidden !important;
`;

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
