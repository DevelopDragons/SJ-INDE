/** @jsxImportSource @emotion/react */
import { css, keyframes } from "@emotion/react";
import { motion, Variants } from "framer-motion";
import { colors } from "../../styles/colors";

interface PageTitleProps {
  title: string;
  subTitle: string;
}

const pageTitleVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

export default function PageTitle({ title, subTitle }: PageTitleProps) {
  return (
    <section css={pageTitleSectionStyle}>
      {/* 배경 장식: 불필요한 텍스트 대신 은은한 빛의 흐름만 남김 */}
      <div css={bgDecorationWrapper}>
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="grid-overlay" />
      </div>

      <div css={pageTitleContentStyle}>
        <motion.div
          initial="hidden"
          animate="show"
          variants={pageTitleVariants}
          css={titleContainerStyle}
        >
          <h1 css={pageTitleTitleStyle}>{title}</h1>
        </motion.div>

        <motion.p
          css={pageTitleSubtitleStyle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          {subTitle}
        </motion.p>

        {/* 하단 데코 라인: 조금 더 포인트가 되도록 두께와 길이 조정 */}
        <motion.div
          css={bottomLineStyle}
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "60px", opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        />
      </div>
    </section>
  );
}

// --- 애니메이션 ---
const move = keyframes`
  0% { transform: translate(0, 0) rotate(0deg); }
  33% { transform: translate(5%, 10%) rotate(5deg); }
  66% { transform: translate(-5%, 5%) rotate(-5deg); }
  100% { transform: translate(0, 0) rotate(0deg); }
`;

// --- 스타일 ---
const pageTitleSectionStyle = css`
  position: relative;
  height: 55vh;
  background-color: #0d0e10; /* 조금 더 깊이감 있는 블랙 */
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const bgDecorationWrapper = css`
  position: absolute;
  inset: 0;

  .blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(100px);
    opacity: 0.12;
    animation: ${move} 15s infinite linear;
  }

  .blob-1 {
    width: 500px;
    height: 500px;
    background: ${colors.primary};
    top: -150px;
    right: -100px;
  }

  .blob-2 {
    width: 400px;
    height: 400px;
    background: ${colors.gray[600]};
    bottom: -100px;
    left: -80px;
    animation-delay: -3s;
  }

  /* 미세한 그리드 패턴으로 전문적인 느낌 추가 */
  .grid-overlay {
    position: absolute;
    inset: 0;
    background-image: radial-gradient(
      rgba(255, 255, 255, 0.05) 1px,
      transparent 1px
    );
    background-size: 30px 30px;
    mask-image: linear-gradient(to bottom, transparent, black, transparent);
  }
`;

const pageTitleContentStyle = css`
  position: relative;
  z-index: 10;
  text-align: center;
  color: ${colors.white};
`;

const titleContainerStyle = css`
  margin-bottom: 1rem;
`;

const pageTitleTitleStyle = css`
  font-size: 4.5rem;
  font-weight: 900;
  letter-spacing: -0.03em;
  text-transform: uppercase;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 3.2rem;
  }
`;

const pageTitleSubtitleStyle = css`
  font-size: 1.2rem;
  color: ${colors.gray[400]};
  font-weight: 400;
  letter-spacing: 0.1em;
  word-spacing: 0.1em;

  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 0 1rem;
  }
`;

const bottomLineStyle = css`
  height: 3px;
  background-color: ${colors.primary};
  margin: 2.5rem auto 0;
  border-radius: 2px;
`;
