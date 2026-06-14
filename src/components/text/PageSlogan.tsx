/** @jsxImportSource @emotion/react */
"use client";

import { ReactNode } from "react";
import { css } from "@emotion/react";
import { motion, Variants } from "framer-motion";
import { colors } from "@/src/styles/colors";

interface PageSloganProps {
  topLabel: string;
  title: ReactNode; // <span> 태그나 텍스트를 자유롭게 혼용할 수 있도록 ReactNode 설정
  description: string;
}

const revealVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.215, 0.61, 0.355, 1] },
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

export default function PageSlogan({
  topLabel,
  title,
  description,
}: PageSloganProps) {
  return (
    <section css={philosophySectionStyle}>
      <div css={containerCustomStyle}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          css={philosophyContentStyle}
        >
          <motion.span css={topLabelStyle} variants={revealVariants}>
            {topLabel}
          </motion.span>

          <motion.h2 css={bigSloganStyle} variants={revealVariants}>
            {title}
          </motion.h2>

          <motion.div css={descriptionWrapperStyle} variants={revealVariants}>
            <p css={mainDescStyle}>{description}</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// --- Styles (기존 About Page의 스타일 무드 정밀 이관) ---

const philosophySectionStyle = css`
  padding: 8rem 0;
  background-color: ${colors.white};
  text-align: center;
  width: 100%;
`;

const containerCustomStyle = css`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const philosophyContentStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const topLabelStyle = css`
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.4em;
  color: ${colors.accent};
  margin-bottom: 1.5rem;
`;

const bigSloganStyle = css`
  font-size: 5rem;
  font-weight: 900;
  line-height: 1.1;
  color: ${colors.primary};
  margin-bottom: 3rem;
  letter-spacing: -0.03em;

  .outline {
    color: transparent;
    -webkit-text-stroke: 2px ${colors.primary};
    opacity: 0.4;
    transition: opacity 0.3s ease;

    &:hover {
      opacity: 0.8;
    }
  }

  .accent {
    color: ${colors.primary};
  }

  @media (max-width: 768px) {
    font-size: 2.8rem;
    .outline {
      -webkit-text-stroke: 1px ${colors.primary};
    }
  }
`;

const descriptionWrapperStyle = css`
  max-width: 720px;
`;

const mainDescStyle = css`
  font-size: 1.125rem;
  line-height: 1.8;
  color: ${colors.gray[600]};
  white-space: pre-wrap;
  word-break: keep-all;
  font-weight: 400;
`;
