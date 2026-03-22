/** @jsxImportSource @emotion/react */
"use client";

import { css } from "@emotion/react";
import { motion, Variants } from "framer-motion";
import { colors } from "@/src/styles/colors";
import { data_about } from "@/public/data/about";
import PageTitle from "@/src/components/text/PageTitle";

export default function CompanyAboutPage() {
  // 세련된 애니메이션을 위한 Variants
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

  return (
    <div css={aboutPageContainerStyle}>
      <PageTitle
        title={"ABOUT US"}
        subTitle={"건축과 인테리어, 공간의 본질을 설계합니다"}
      />

      {/* 1. Philosophy Section: 정제된 슬로건과 텍스트 */}
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
              DESIGN PHILOSOPHY
            </motion.span>

            <motion.h2 css={bigSloganStyle} variants={revealVariants}>
              Beyond <span className="outline">Spatial</span>{" "}
              <span className="accent">Essence.</span>
            </motion.h2>

            <motion.div css={descriptionWrapperStyle} variants={revealVariants}>
              <p css={mainDescStyle}>{data_about.desc}</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 2. CEO Message Section: 이미지와 텍스트의 조화 */}
      <section css={ceoSectionStyle}>
        <div css={containerCustomStyle}>
          <div css={ceoContentLayoutStyle}>
            {/* CEO 이미지: 연도 동그라미 삭제 및 그림자 조정 */}
            <motion.div
              css={ceoImageAreaStyle}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <img
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200"
                alt="Studio Atmosphere"
              />
            </motion.div>

            {/* CEO 메시지 영역: 타이포그래피 강조 */}
            <motion.div
              css={ceoMessageWrapperStyle}
              initial="hidden"
              whileInView="show"
              variants={containerVariants}
              viewport={{ once: true }}
            >
              <motion.h3 css={ceoGreetingStyle} variants={revealVariants}>
                인간과 환경, <br />
                문화를 하나로 통일합니다.
              </motion.h3>

              <motion.div css={ceoTextBodyStyle} variants={revealVariants}>
                {/* \n\n (연속된 줄바꿈)을 기준으로 문단을 나눕니다 */}
                {data_about.message.split("\n\n").map((paragraph, i) => (
                  <p key={i} css={paragraphStyle}>
                    {paragraph}
                  </p>
                ))}
              </motion.div>

              <motion.div css={ceoSignAreaStyle} variants={revealVariants}>
                <div css={dividerStyle} />
                <p css={ceoNameStyle}>
                  <strong>SUNJUN ID</strong> 대표 <span>{data_about.ceo}</span>
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

// --- Styles ---

const aboutPageContainerStyle = css`
  padding-top: 60px;
`;

const containerCustomStyle = css`
  max-width: 1200px; /* 너무 퍼지지 않게 조정 */
  margin: 0 auto;
  padding: 0 2rem;
`;

/* Philosophy Section */
const philosophySectionStyle = css`
  padding: 8rem 0; /* 12rem -> 8rem 여백 축소 */
  background-color: ${colors.white};
  text-align: center;
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
  letter-spacing: -0.03em; /* 전체적으로 자간을 조여서 단단한 느낌 부여 */

  .outline {
    color: transparent;
    -webkit-text-stroke: 2px ${colors.primary};
    opacity: 0.4;
    transition: opacity 0.3s ease;

    &:hover {
      opacity: 0.8; /* 호버 시 살짝 더 진해지는 인터렉션 (선택 사항) */
    }
  }

  .accent {
    color: ${colors.primary};
    /* Essence 부분에 미세한 강조 효과를 주고 싶다면 여기에 추가 */
  }

  @media (max-width: 768px) {
    font-size: 2.8rem;
    .outline {
      -webkit-text-stroke: 1px ${colors.primary}; /* 모바일은 다시 얇게 */
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

/* CEO Section */
const ceoSectionStyle = css`
  padding: 8rem 0;
  background-color: ${colors.gray[100]};
`;

/* CEO 이미지 영역 수정 */
const ceoImageAreaStyle = css`
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1.2;
  overflow: hidden; /* 이미지가 밖으로 나가지 않도록 고정 */
  border-radius: 2px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: grayscale(100%);
    transition: transform 1.2s ease-out;

    /* 호버 시 이미지가 부드럽게 커지는 효과 (선택사항) */
    &:hover {
      transform: scale(1.05);
    }
  }

  @media (max-width: 1024px) {
    max-width: 600px; /* 너무 커지는 것 방지 */
    margin: 0 auto; /* 중앙 정렬 */
  }
`;

/* 레이아웃 그리드 조정 */
const ceoContentLayoutStyle = css`
  display: grid;
  grid-template-columns: 1fr 1.2fr; /* 비율을 텍스트 쪽으로 좀 더 배분 */
  gap: 4rem; /* 여백을 조금 줄여서 안정감 확보 */
  align-items: flex-start;

  @media (max-width: 1200px) {
    gap: 3rem;
  }

  @media (max-width: 1024px) {
    grid-template-columns: 1fr; /* 세로 배치 */
    gap: 4rem;
  }
`;

const ceoMessageWrapperStyle = css`
  display: flex;
  flex-direction: column;
`;

const ceoGreetingStyle = css`
  font-size: 2rem;
  font-weight: 800;
  line-height: 1.35;
  color: ${colors.primary};
  margin-bottom: 2.5rem;
  letter-spacing: -0.02em;
`;

const ceoTextBodyStyle = css`
  display: flex;
  flex-direction: column;
  gap: 2rem; /* 문단과 문단 사이의 간격을 확실하게 부여 */
`;

const paragraphStyle = css`
  line-height: 1.5; /* 줄간격을 조금 더 넓혀서 가독성 확보 */
  color: ${colors.gray[600]};
  font-size: 1.05rem;
  white-space: pre-wrap; /* 문단 내부의 단일 줄바꿈은 유지 */
  word-break: keep-all;
`;

const ceoSignAreaStyle = css`
  margin-top: 3rem;
`;

const dividerStyle = css`
  width: 40px;
  height: 1px;
  background-color: ${colors.primary};
  margin-bottom: 1.5rem;
`;

const ceoNameStyle = css`
  font-size: 1.1rem;
  color: ${colors.gray[500]};

  strong {
    color: ${colors.primary};
    font-weight: 800;
    margin-right: 0.5rem;
  }

  span {
    font-size: 1.4rem;
    font-weight: 700;
    color: ${colors.gray[800]};
    margin-left: 0.75rem;
    position: relative;
    /* 점 디자인(&::before) 삭제 */
  }
`;
