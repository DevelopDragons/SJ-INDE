/** @jsxImportSource @emotion/react */
"use client";

import { css } from "@emotion/react";
import Image from "next/image";
import { motion, Transition } from "framer-motion";
import BlurredBgButton from "../common/BlurredBgButton";
import { colors } from "@/src/styles/colors";

interface SectionProps {
  sec: {
    id: string;
    view: string;
    title: string;
    content?: string;
    path?: string;
  };
  sectionRef: (el: HTMLElement | null) => void;
  onNext?: () => void; // 다음 섹션 이동 함수 추가
}

export default function BasicSection({
  sec,
  sectionRef,
  onNext,
}: SectionProps) {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
  };

  const customTransition: Transition = {
    duration: 0.8,
    ease: [0.16, 1, 0.3, 1],
  };

  return (
    <section id={sec.id} ref={sectionRef} css={sectionStyle}>
      {/* 배경 및 오버레이 */}
      <div css={bgWrapperStyle}>
        {/* 💡 [수정] 인라인 style을 걷어내고 css 속성(mainImageStyle)을 주입하여 
            Next.js 내부 스타일을 이기고 이미지를 아래로 내립니다. */}
        <Image
          src={`/images/${sec.id}.jpg`}
          alt={sec.id}
          fill
          priority={sec.id === "main"}
          css={mainImageStyle(sec.id)}
        />
        <div css={overlayStyle} />
      </div>

      {/* sec.id를 넘겨 main일 때 아래쪽 패딩을 밀어 올리도록 조작합니다. */}
      <div css={contentStyle(sec.id)}>
        {/* VIEW TAG */}
        <motion.div
          {...fadeInUp}
          transition={{ ...customTransition, delay: 0.1 }}
        >
          <div css={viewTagStyle}>{sec.view}</div>
        </motion.div>

        {/* DIVIDER */}
        {sec.id !== "main" && (
          <motion.div
            {...fadeInUp}
            transition={{ ...customTransition, delay: 0.2 }}
          >
            <div css={dividerStyle} />
          </motion.div>
        )}

        {/* TITLE */}
        {sec.title && (
          <motion.h1
            css={titleStyle}
            {...fadeInUp}
            transition={{ ...customTransition, delay: 0.3 }}
          >
            {sec.title}
          </motion.h1>
        )}

        {/* CONTENT */}
        {sec.content && (
          <motion.p
            css={descStyle}
            {...fadeInUp}
            transition={{ ...customTransition, delay: 0.4 }}
            dangerouslySetInnerHTML={{ __html: sec.content }}
          />
        )}

        {/* BUTTON */}
        {sec.id !== "main" && (
          <motion.div
            {...fadeInUp}
            transition={{ ...customTransition, delay: 0.5 }}
          >
            <div css={buttonAreaStyle}>
              <BlurredBgButton href={`/${sec.path}`} variant="outline">
                Detail →
              </BlurredBgButton>
            </div>
          </motion.div>
        )}
      </div>

      {/* --- 마우스 아이콘 스크롤 유도 버튼 --- */}
      {sec.id === "main" && (
        <motion.div
          css={scrollContainerStyle}
          onClick={onNext} // 부모의 이동 함수 호출
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div css={mouseStyle}>
            <motion.div
              css={wheelStyle}
              animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
          <span css={scrollTextStyle}>CLICK TO EXPLORE</span>
        </motion.div>
      )}
    </section>
  );
}

// --- Styles ---

const sectionStyle = css({
  position: "relative",
  height: "100vh",
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
});

const bgWrapperStyle = css({ position: "absolute", inset: 0, zIndex: 0 });

/* 💡 [핵심 추가] main일 때 이미지를 미세하게 아래로 정렬시키는 전용 스타일 */
const mainImageStyle = (id: string) => css`
  object-fit: cover !important;

  /* 기본값은 center(50% 50%)입니다. 
     Y축 축적을 center top(또는 30%~40%) 쪽으로 올려주면, 이미지 내용물 전체가 아래로 밀려 내려갑니다. */
  object-position: ${id === "main"
    ? "center 35% !important"
    : "center !important"};
`;

const overlayStyle = css({
  position: "absolute",
  inset: 0,
  background:
    "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 100%)",
  zIndex: 1,
});

const contentStyle = (id: string) => css`
  position: relative;
  z-index: 2;
  color: ${colors.white};
  text-align: center;
  width: 100%;
  padding: 0 150px;

  ${id === "main" &&
  css`
    padding-bottom: 250px;
  `}

  @media (max-width: 768px) {
    padding: 0 100px;
    ${id === "main" &&
    css`
      padding-bottom: 150px;
    `}
  }
  @media (max-width: 480px) {
    padding: 0 30px;
    ${id === "main" &&
    css`
      padding-bottom: 100px;
    `}
  }
`;

const viewTagStyle = css({
  fontSize: "1.5rem",
  fontWeight: 800,
  letterSpacing: "0.1em",
  color: colors.white,
});

const dividerStyle = css({
  width: "30px",
  height: "3px",
  backgroundColor: colors.white,
  margin: "1.5rem auto",
});

const descStyle = css({
  fontSize: "3rem",
  fontWeight: 500,
  lineHeight: 1.4,
  maxWidth: "90%",
  margin: "0 auto 2.5rem",
  opacity: 0.9,
  whiteSpace: "pre-line",
  "& b": {
    fontWeight: 900,
    color: colors.white,
    position: "relative",
    display: "inline-block",
  },
  "@media (max-width: 768px)": { fontSize: "1.8rem" },
});

const titleStyle = css({
  fontSize: "2rem",
  fontWeight: 700,
  letterSpacing: "-0.02em",
  marginBottom: "1rem",
  opacity: 0.8,
});

const buttonAreaStyle = css({ marginTop: "1rem" });

const scrollContainerStyle = css({
  position: "absolute",
  bottom: "50px",
  left: "50%",
  transform: "translateX(-50%)",
  zIndex: 10,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "12px",
  cursor: "pointer",
  "&:hover span": {
    opacity: 1,
    letterSpacing: "0.3em",
  },
});

const mouseStyle = css({
  width: "26px",
  height: "44px",
  border: `2px solid ${colors.white}`,
  borderRadius: "15px",
  position: "relative",
  display: "flex",
  justifyContent: "center",
  paddingTop: "8px",
});

const wheelStyle = css({
  width: "4px",
  height: "8px",
  backgroundColor: colors.white,
  borderRadius: "2px",
});

const scrollTextStyle = css({
  fontSize: "0.65rem",
  fontWeight: 600,
  letterSpacing: "0.2em",
  color: colors.white,
  opacity: 0.6,
  transition: "all 0.3s ease",
  textTransform: "uppercase",
});
