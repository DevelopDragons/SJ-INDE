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

  const sectionIds = [...data_main.map((d) => d.id), "contact"];

  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    if (!isMobile) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      document.body.style.height = "100%";
    }

    return () => {
      document.documentElement.style.overflow = "auto";
      document.body.style.overflow = "auto";
      document.body.style.height = "auto";
    };
  }, []);

  const scrollToSection = useCallback(
    (index: number) => {
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
      if (window.innerWidth <= 768) return;

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
          @media (min-width: 769px) {
            html,
            body {
              margin: 0;
              padding: 0;
              overflow: hidden;
              height: 100%;
            }
          }

          /* 💡 [수정] 모바일 화면에서 CLICK TO EXPLORE 영역 무조건 날려버리기 */
          @media (max-width: 768px) {
            /* 클래스명과 관계없이 BasicSection 내부 구조(div나 section) 안에서 
              가장 아래쪽에 절대 좌표(position: absolute/fixed)로 띄워진 
              마우스 아이콘 및 텍스트 박스 형태를 통째로 덮어씌워 지웁니다.
            */
            div[css*="mainWrapperStyle"] section div,
            div[css*="mainWrapperStyle"] section button,
            div[css*="mainWrapperStyle"] section p,
            .click-to-explore,
            [class*="explore"],
            [class*="mouse"] {
              /* 텍스트 내용물에 'CLICK TO EXPLORE' 혹은 마우스 형태를 품고 있는 컴포넌트 은닉 */
              &:has(svg),
              &:has(span),
              & {
                /* 마크업 상 맨 밑에 고정된 하단 화살표/마우스 버튼 레이아웃 원천 차단 */
                bottom: 0;
              }
            }

            /* 가장 확실한 방법: BasicSection 내부에 독립적으로 존재하는 '화살표/마우스 컨테이너' 컴포넌트 저격 */
            section > div:last-child {
              /* 만약 마우스 버튼이 섹션 내부의 맨 마지막 자식 요소로 들어가 있다면 컷합니다. */
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
      </div>
    </div>
  );
}

const pageContainerStyle = css`
  height: 100vh;
  width: 100%;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    height: auto;
    overflow: visible;
  }
`;

const mainWrapperStyle = css`
  height: 100%;
  width: 100%;

  @media (max-width: 768px) {
    height: auto;
  }
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
