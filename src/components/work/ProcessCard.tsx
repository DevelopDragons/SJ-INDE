/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { motion, Variants } from "framer-motion";
import { colors } from "../../styles/colors";
import { WorkProcess } from "@/public/data/work";

interface WorkProcessCardProps {
  index: number;
  process: WorkProcess;
  variants: Variants;
}

export default function WorkProcessCard({
  process,
  variants,
}: WorkProcessCardProps) {
  const { step, title, description } = process;

  // unDraw 일러스트 파일명 매칭
  // const illustrationSrc = `/images/work_process/${step}.svg`;

  return (
    <motion.div css={processCardStyle} variants={variants}>
      <div css={processCardContentStyle}>
        <div css={processCardStepNumStyle}>{step}</div>
        <h3 css={processCardTitleStyle}>{title}</h3>
        <p css={processCardDescriptionStyle}>{description}</p>
      </div>
    </motion.div>
  );
}

// --- Styles ---

const processCardStyle = css`
  background-color: ${colors.white};
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow:
    0 1px 3px 0 rgba(0, 0, 0, 0.1),
    0 1px 2px 0 rgba(0, 0, 0, 0.06);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
  height: 100%;

  &:hover {
    box-shadow:
      0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -2px rgba(0, 0, 0, 0.05);
    transform: translateY(-5px);
  }
`;

const processCardContentStyle = css`
  position: relative;
  z-index: 10;
  /* 콘텐츠가 적어도 하단 정렬이 깨지지 않게 flex 활용 가능 */
`;

const processCardStepNumStyle = css`
  font-size: 1.875rem;
  font-weight: 700;
  color: ${colors.accent};
  margin-bottom: 0.5rem;
`;

const processCardTitleStyle = css`
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: ${colors.gray[800]};
  word-break: keep-all;
`;

const processCardDescriptionStyle = css`
  font-size: 0.95rem;
  line-height: 1.6;
  color: ${colors.gray[600]};
  word-break: keep-all;
`;
