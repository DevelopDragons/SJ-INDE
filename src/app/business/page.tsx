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
  // 🎬 컨테이너는 이제 자식들에게 순차적 지연(stagger)만 전달합니다.
  const containerVariants = {
    hidden: { opacity: 1 }, // 💡 모바일 렌더링 방어를 위해 컨테이너 자체 오파시티 락을 해제합니다.
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 }, // 💡 모바일에서 너무 쿵 떨어지지 않게 y축 이동을 50 -> 30으로 최적화
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
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
          {/* 💡 핵심 교정: amount를 0.1(10%)로 대폭 낮추어 모바일에서 조금만 걸쳐도 즉시 카드가 출력되도록 바꿉니다. */}
          <motion.div
            css={categoryGridStyle}
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
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
          {/* 💡 공통 조치: 프로세스 섹션 역시 긴 그리드 스크롤 대응을 위해 amount를 0.1로 동기화합니다. */}
          <motion.div
            css={processGridStyle}
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
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
            viewport={{ once: true, amount: 0.2 }}
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
  padding-top: 0px; /* 💡 globals.css에서 서브페이지 기본 90px 패딩을 주므로 0으로 초기화하거나 알맞게 조절 */
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
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
`;

const categorySectionStyle = css`
  padding-top: 4rem;
  padding-bottom: 8rem;
  background-color: ${colors.white};
  @media (max-width: 768px) {
    padding-top: 2rem;
    padding-bottom: 4rem;
  }
`;

const categoryGridStyle = css`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-top: 3rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const processSectionStyle = css`
  width: 100%;
  padding-top: 4rem;
  padding-bottom: 7rem;
  background-color: ${colors.gray[100]};
  display: flex;
  flex-direction: column;
  overflow: hidden;

  @media (max-width: 768px) {
    padding-top: 2rem;
    padding-bottom: 4rem;
  }
`;

const processGridStyle = css`
  display: grid;
  grid-template-columns: 1fr;
  row-gap: 2.5rem;
  column-gap: 2rem;
  margin-top: 4rem; /* 💡 데스크탑 기준 마진 조정 */

  @media (max-width: 768px) {
    margin-top: 2.5rem; /* 💡 모바일에서는 타이틀과 카드 사이 간격 압축 */
  }

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const ctaSectionStyle = css`
  padding-top: 8rem;
  padding-bottom: 8rem;
  background-color: ${colors.primary};
  color: ${colors.white};

  @media (max-width: 768px) {
    padding-top: 5rem;
    padding-bottom: 5rem;
  }
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
  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

const ctaDescriptionStyle = css`
  font-size: 1.25rem;
  margin-bottom: 2rem;
  color: ${colors.gray[300]};
  @media (max-width: 768px) {
    font-size: 1rem;
  }
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
