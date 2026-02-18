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

  // 클릭 시 한 섹션 아래로 이동하는 함수
  const handleScrollClick = () => {
    const nextSection = document.getElementById(sec.id)?.nextElementSibling;
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id={sec.id} ref={sectionRef} css={sectionStyle}>
      {/* 배경 및 오버레이 */}
      <div css={bgWrapperStyle}>
        <Image
          src={`/images/${sec.id}.jpg`}
          alt={sec.id}
          fill
          priority={sec.id === "main"}
          style={{ objectFit: "cover" }}
        />
        <div css={overlayStyle} />
      </div>

      <div css={contentStyle}>
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

const overlayStyle = css({
  position: "absolute",
  inset: 0,
  background:
    "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 100%)",
  zIndex: 1,
});

const contentStyle = css({
  position: "relative",
  zIndex: 2,
  color: colors.white,
  textAlign: "center",
  width: "100%",
  padding: "0 150px",
  "@media (max-width: 768px)": { padding: "0 100px" },
  "@media (max-width: 480px)": { padding: "0 30px" },
});

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

// --- 스크롤 아이콘 스타일 ---

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
  cursor: "pointer", // 클릭 가능함을 알림
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
