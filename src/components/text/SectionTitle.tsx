/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { motion, Variant, Variants } from "framer-motion";
import { colors } from "../../styles/colors";

interface SectionTitleProps {
  title: string;
  underline: boolean;
  subTitle?: string;
  variants: Variants;
}

export default function SectionTitle(props: SectionTitleProps) {
  return (
    <motion.div
      css={sectionHeaderStyle}
      variants={props.variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
    >
      {/* 타이틀 */}
      <h2 css={sectionTitleStyle}>{props.title}</h2>
      {/* 구분선 */}
      {props.underline && <div css={dividerAccentStyle}></div>}
      {/* 서브타이틀 */}
      {props.subTitle && <p css={sectionDescriptionStyle}>{props.subTitle}</p>}
    </motion.div>
  );
}

// Section Header (공통 스타일)
const sectionHeaderStyle = css`
  margin-bottom: 4rem;
  text-align: center;
`;

const sectionTitleStyle = css`
  font-size: 2.25rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: ${colors.gray[800]};
`;

const dividerAccentStyle = css`
  height: 4px;
  width: 80px;
  background-color: ${colors.primary};
  margin: 0 auto 2rem auto;
`;

const sectionDescriptionStyle = css`
  font-size: 1.125rem;
  color: ${colors.gray[600]};
`;
