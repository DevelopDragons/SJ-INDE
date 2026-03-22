/** @jsxImportSource @emotion/react */
"use client";

import { css } from "@emotion/react";
import { motion, Variants } from "framer-motion";
import { colors } from "@/src/styles/colors"; // 가정: styles/colors.ts 파일 존재
import { data_work_category, data_work_process } from "@/public/data/work";
import SectionTitle from "@/src/components/text/SectionTitle";
import WorkCategoryCard from "@/src/components/work/CategoryCard";
import PageTitle from "@/src/components/text/PageTitle";
import WorkProcessCard from "@/src/components/work/ProcessCard";

export default function WorkPage() {
  // Framer Motion 애니메이션 Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // 자식 요소들이 순차적으로 애니메이션되도록
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <div css={workPageContainerStyle}>
      {/* Page Title Section */}
      <PageTitle title={"BUSINESS"} subTitle={"사업 분야 및 프로세스"} />

      {/* Category Section */}
      <section css={categorySectionStyle}>
        <div css={containerCustomStyle}>
          <SectionTitle
            title={"Work Category"}
            subTitle={
              "선준아이디는 다양한 분야에서 전문적인 서비스를 제공합니다"
            }
            underline={true}
            variants={itemVariants}
          />

          <motion.div
            css={categoryGridStyle}
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            {data_work_category.map((item, index) => (
              <WorkCategoryCard
                key={index}
                index={index}
                category={item}
                variants={itemVariants}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" css={processSectionStyle}>
        <div css={containerCustomStyle}>
          <SectionTitle
            title={"Work Process"}
            subTitle={"프로젝트의 전 과정을 단계별로 체계적으로 관리합니다."}
            underline={true}
            variants={itemVariants}
          />

          <motion.div
            css={processGridStyle}
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            {data_work_process.map((item, index) => (
              <WorkProcessCard
                key={index}
                index={index}
                process={item}
                variants={itemVariants}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA(Call to Action) Section */}
      <section css={ctaSectionStyle}>
        <div css={containerCustomStyle}>
          <motion.div
            css={ctaContentStyle}
            variants={itemVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            <h2 css={ctaTitleStyle}>프로젝트를 시작할 준비가 되셨나요?</h2>
            <p css={ctaDescriptionStyle}>
              선준아이디와 함께 가치 있는 공간을 만들어보세요
            </p>
            <motion.a
              href="/contact"
              css={ctaButtonStyle}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              문의하기
            </motion.a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

// --- Styles ---

const workPageContainerStyle = css`
  padding-top: 80px; /* 고정 헤더가 있다면 */
`;

const containerCustomStyle = css`
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1.5rem;
  padding-right: 1.5rem;

  @media (max-width: 768px) {
    padding-left: 1rem;
    padding-right: 1rem;
  }
`;

// Category Section
const categorySectionStyle = css`
  padding-top: 6rem;
  padding-bottom: 6rem;
  background-color: ${colors.white};
`;

const categoryGridStyle = css`
  display: grid;
  grid-template-columns: 1fr; /* 모바일: 1열 */
  gap: 2rem;

  /* 태블릿 및 작은 노트북 (768px 이상) */
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr); /* 2열 */
  }

  /* 데스크탑 (1024px 이상) */
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr); /* 3열 */
  }
`;
// Process Section
const processSectionStyle = css`
  padding-top: 6rem;
  padding-bottom: 6rem;
  background-color: ${colors.gray[100]};
`;

const processGridStyle = css`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

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

  &:hover {
    box-shadow:
      0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -2px rgba(0, 0, 0, 0.05);
    transform: translateY(-5px);
  }
`;

// CTA Section
const ctaSectionStyle = css`
  padding-top: 6rem;
  padding-bottom: 6rem;
  background-color: ${colors.primary};
  color: ${colors.white};
`;

const ctaContentStyle = css`
  max-width: 896px;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
`;

const ctaTitleStyle = css`
  font-size: 2.25rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
`;

const ctaDescriptionStyle = css`
  font-size: 1.25rem;
  margin-bottom: 2rem;
  color: ${colors.gray[300]};
`;

const ctaButtonStyle = css`
  display: inline-block;
  padding: 1rem 3rem;
  background-color: ${colors.white};
  color: ${colors.primary};
  font-weight: 700;
  border-radius: 0;
  text-decoration: none;
  transition:
    background-color 0.3s ease-in-out,
    transform 0.2s ease-in-out;

  &:hover {
    background-color: ${colors.gray[100]};
  }
`;
