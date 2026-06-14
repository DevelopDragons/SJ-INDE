/** @jsxImportSource @emotion/react */
"use client";

import { css } from "@emotion/react";
import { motion, Variants } from "framer-motion";
import { colors } from "@/src/styles/colors";
import { data_work_category, data_work_process } from "@/public/data/work";
import PageSlogan from "@/src/components/text/PageSlogan";
import WorkCategoryCard from "@/src/components/work/CategoryCard";
import WorkProcessCard from "@/src/components/work/ProcessCard";

export default function WorkPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <div css={workPageContainerStyle}>
      {/* Category Section */}
      <section css={categorySectionStyle}>
        <PageSlogan
          topLabel="WORK CATEGORY"
          title={
            <>
              Tailored <span className="outline">Spatial</span>{" "}
              <span className="accent">Solutions.</span>
            </>
          }
          description="전문적인 설계와 감각적인 디렉팅을 통해 주거부터 상업 공간까지 최상의 공간 가치를 제안합니다."
        />

        <div css={containerCustomStyle}>
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
        <PageSlogan
          topLabel="WORK PROCESS"
          title={
            <>
              Systematic <span className="outline">Design</span>{" "}
              <span className="accent">Journey.</span>
            </>
          }
          description="기획부터 완공까지, 선준아이디만의 체계적인 프로세스로 프로젝트의 완성도를 높입니다."
        />

        <div css={containerCustomStyle}>
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

const workPageContainerStyle = css`
  padding-top: 60px;
  width: 100%;
`;

const containerCustomStyle = css`
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 2rem;
  padding-right: 2rem;
  width: 100%;

  @media (max-width: 768px) {
    padding-left: 1rem;
    padding-right: 1rem;
  }
`;

// Category Section
const categorySectionStyle = css`
  padding-bottom: 8rem;
  background-color: ${colors.white};
`;

const categoryGridStyle = css`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-top: 2rem; /* 💡 음수 마진(-1rem) 제거하고 패딩 공간 확보 */

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

// Process Section
const processSectionStyle = css`
  width: 100%;
  padding-bottom: 7rem;
  background-color: ${colors.gray[100]};
  display: flex;
  flex-direction: column;
  /* 💡 애니메이션으로 인한 상단 삐져나침을 원천 차단하기 위해 섹션 자체에 숨김 처리 추가 */
  overflow: hidden;
`;

const processGridStyle = css`
  display: grid;
  grid-template-columns: 1fr;
  row-gap: 2.5rem;
  column-gap: 2rem;

  /* 💡 핵심 수정: 마이너스 마진(-1rem)을 버리고, 
     Framer motion이 위로 격하게(y: 50) 솟구쳐도 회색 영역 안에서 놀 수 있도록 상단 여백을 넉넉히 줍니다. */
  margin-top: 7rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

// CTA Section
const ctaSectionStyle = css`
  padding-top: 8rem;
  padding-bottom: 8rem;
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
