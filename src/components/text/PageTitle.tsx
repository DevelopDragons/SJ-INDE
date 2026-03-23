/** @jsxImportSource @emotion/react */
import { css, keyframes } from "@emotion/react";
import { motion, Variants } from "framer-motion";
import { colors } from "../../styles/colors";

interface PageTitleProps {
  title: string;
  subTitle: string;
}

const pageTitleVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

export default function PageTitle({ title, subTitle }: PageTitleProps) {
  return (
    <section css={pageTitleSectionStyle}>
      {/* 배경 장식 요소들 */}
      <div css={bgDecorationWrapper}>
        <div className="blob blob-1" />
        <div className="blob blob-2" />
      </div>

      <div css={pageTitleContentStyle}>
        <motion.div
          initial="hidden"
          animate="show"
          variants={pageTitleVariants}
          css={titleWrapperStyle}
        >
          <span className="bg-text">{title}</span>
          <h1 css={pageTitleTitleStyle}>{title}</h1>
        </motion.div>

        <motion.p
          css={pageTitleSubtitleStyle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          {subTitle}
        </motion.p>

        {/* 하단 데코 라인 */}
        <motion.div
          css={bottomLineStyle}
          initial={{ width: 0 }}
          animate={{ width: "40px" }}
          transition={{ delay: 0.8, duration: 0.6 }}
        />
      </div>
    </section>
  );
}

// --- 애니메이션 ---
const move = keyframes`
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(10%, 5%) scale(1.1); }
  100% { transform: translate(0, 0) scale(1); }
`;

// --- 스타일 ---
const pageTitleSectionStyle = css`
  position: relative;
  height: 60vh; /* 조금 더 시원하게 높임 */
  background-color: ${colors.gray[900]};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const bgDecorationWrapper = css`
  position: absolute;
  inset: 0;
  overflow: hidden;
  .blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.15;
    animation: ${move} 10s infinite ease-in-out;
  }
  .blob-1 {
    width: 400px;
    height: 400px;
    background: ${colors.primary};
    top: -100px;
    right: -50px;
  }
  .blob-2 {
    width: 350px;
    height: 350px;
    background: #5e5e5e;
    bottom: -50px;
    left: -50px;
    animation-delay: -2s;
  }
`;

const pageTitleContentStyle = css`
  position: relative;
  z-index: 10;
  text-align: center;
  color: ${colors.white};
  padding: 0 2rem;
`;

const titleWrapperStyle = css`
  position: relative;
  margin-bottom: 1.5rem;

  .bg-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 8rem;
    font-weight: 900;
    color: ${colors.white};
    opacity: 0.03; /* 아주 희미하게 배경처럼 깔리는 텍스트 */
    white-space: nowrap;
    letter-spacing: 0.2em;
    @media (max-width: 768px) {
      font-size: 5rem;
    }
  }
`;

const pageTitleTitleStyle = css`
  font-size: 4rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  text-transform: uppercase;
  @media (max-width: 768px) {
    font-size: 3rem;
  }
`;

const pageTitleSubtitleStyle = css`
  font-size: 1.1rem;
  color: ${colors.gray[400]};
  font-weight: 400;
  letter-spacing: 0.05em;
  text-transform: uppercase;
`;

const bottomLineStyle = css`
  height: 2px;
  background-color: ${colors.primary};
  margin: 2rem auto 0;
`;
