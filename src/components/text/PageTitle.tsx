/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
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

export default function PageTitle(props: PageTitleProps) {
  return (
    <section css={pageTitleSectionStyle}>
      <div css={pageTitleContentStyle}>
        <motion.h1
          css={pageTitleTitleStyle}
          variants={pageTitleVariants}
          initial="hidden"
          animate="show"
        >
          {props.title}
        </motion.h1>
        <motion.p
          css={pageTitleSubtitleStyle}
          variants={pageTitleVariants}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.2 }}
        >
          {props.subTitle}
        </motion.p>
      </div>
    </section>
  );
}

const pageTitleSectionStyle = css`
  position: relative;
  height: 50vh;
  background: linear-gradient(to br, ${colors.gray[900]}, ${colors.gray[800]});
  display: flex;
  align-items: center;
  justify-content: center;
`;

const pageTitleContentStyle = css`
  text-align: center;
  color: ${colors.white};
`;

const pageTitleTitleStyle = css`
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1rem;

  @media (min-width: 768px) {
    font-size: 4rem;
  }
`;

const pageTitleSubtitleStyle = css`
  font-size: 1.25rem;
  color: ${colors.gray[300]};
`;
