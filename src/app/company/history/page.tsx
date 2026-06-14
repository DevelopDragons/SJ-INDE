/** @jsxImportSource @emotion/react */
"use client";

import { css } from "@emotion/react";
import { motion } from "framer-motion";
import { colors } from "@/src/styles/colors";
import { data_history } from "@/public/data/history";
import Link from "next/link";
import { usePathname } from "next/navigation";
import PageSlogan from "@/src/components/text/PageSlogan";

export default function CompanyHistoryPage() {
  const pathname = usePathname();

  // 🎬 애니메이션 배리언트 설정
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" as const },
    },
  };

  // 💡 1. 과거가 왼쪽, 최신이 오른쪽으로 오도록 배열을 완전히 뒤집습니다 (.reverse())
  const orderedHistory = data_history
    .filter((item) => item.year !== "PRESENT")
    .reverse();

  return (
    <div css={historyPageWrapperStyle}>
      {/* 🧭 우측 서브페이지 네비게이션 */}
      <aside css={asideStyle}>
        <Link
          href="/company/about"
          css={navLinkStyle(pathname === "/company/about")}
        >
          ABOUT US
        </Link>
        <Link
          href="/company/history"
          css={navLinkStyle(pathname === "/company/history")}
        >
          HISTORY
        </Link>
        <Link
          href="/company/organization"
          css={navLinkStyle(pathname === "/company/organization")}
        >
          ORGANIZATION
        </Link>
      </aside>

      <PageSlogan
        topLabel="COMPANY HISTORY"
        title={
          <>
            Our <span className="outline">Valuable</span>{" "}
            <span className="accent">Footprints.</span>
          </>
        }
        description="선준아이디가 묵묵히 걸어온 혁신과 신뢰의 발자취를 소개합니다."
      />

      <section css={historyContentSectionStyle}>
        <div css={containerStyle}>
          {/* 가로 축 중앙선 (데스크탑 전용) */}
          <div css={horizontalLineStyle} />

          <motion.div
            css={historyHorizontalGridStyle}
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            {orderedHistory.map((yearGroup) => (
              <motion.div
                key={yearGroup.year}
                css={historyCardStyle}
                variants={cardVariants}
              >
                {/* 타임라인 포인트 점 */}
                <div css={timelineDotStyle} />

                {/* 연도 헤더 */}
                <h3 css={yearTitleStyle}>{yearGroup.year}</h3>

                {/* 이벤트 리스트 */}
                <div css={eventListStyle}>
                  {yearGroup.events.map((event, idx) => (
                    <div key={idx} className="event-item">
                      <span className="event-date">
                        {String(event.month).padStart(2, "0")}.
                        {String(event.day).padStart(2, "0")}
                      </span>
                      <p className="event-text">{event.content}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}

            {/* 💡 2. 타임라인 대단원의 마침표이자 현재인 'PRESENT'를 가장 우측(마지막)에 배치 */}
            <motion.div css={presentCardStyle} variants={cardVariants}>
              <div css={presentTimelineDotStyle}>
                <div className="pulse-core" />
              </div>
              <h3 css={presentYearTitleStyle}>PRESENT</h3>
              <div css={presentEventListStyle}>
                <p className="present-text">
                  멈추지 않는 도전과 혁신으로{"\n"}새로운 공간의 가치를
                  만들어갑니다.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

// --- Styles ---
const historyPageWrapperStyle = css`
  padding-top: 60px;
  padding-bottom: 120px;
  position: relative;
`;

const historyContentSectionStyle = css`
  width: 100%;
  background-color: ${colors.white};
  overflow: hidden;
`;

const containerStyle = css`
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 2rem 120px 2rem;
  position: relative;

  /* 📱 모바일 환경에서 우측 여백을 대폭 늘려 비대칭 안정감 확보 (오른쪽 여백 3.5rem) */
  @media (max-width: 768px) {
    padding: 40px 3.5rem 80px 1.5rem;
  }
`;

/* 🗺️ 가로 축 정렬 라인 */
const horizontalLineStyle = css`
  position: absolute;
  top: 105px;
  left: 2rem;
  right: 2rem;
  height: 1px;
  background: linear-gradient(
    to right,
    rgba(224, 224, 224, 0.3) 0%,
    ${colors.gray[200]} 20%,
    ${colors.primary} 80%,
    ${colors.primary} 100%
  );

  @media (max-width: 768px) {
    display: none;
  }
`;

/* 🗂️ 가로 레이아웃 그리드 (3개 연도 + 1개 PRESENT = 총 4열 구성) */
const historyHorizontalGridStyle = css`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2.5rem;
  position: relative;
  z-index: 2;

  @media (max-width: 768px) {
    grid-template-columns: 1fr; /* 모바일은 세로 세움 */
    gap: 3.5rem;
  }
`;

const historyCardStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;

  @media (max-width: 768px) {
    align-items: flex-start;
    text-align: left;
    padding-left: 25px;
    border-left: 2px solid ${colors.gray[200]};
  }
`;

const timelineDotStyle = css`
  width: 12px;
  height: 12px;
  background-color: ${colors.gray[300]};
  border-radius: 50%;
  margin-bottom: 1.5rem;
  box-shadow: 0 0 0 6px ${colors.white};
  transition: all 0.3s ease;

  div:hover > & {
    transform: scale(1.3);
    background-color: ${colors.primary};
  }

  @media (max-width: 768px) {
    position: absolute;
    left: -7px;
    top: 6px;
    margin-bottom: 0;
    background-color: ${colors.primary};
  }
`;

const yearTitleStyle = css`
  font-size: 2.2rem;
  font-weight: 800;
  color: ${colors.gray[800]};
  letter-spacing: -0.02em;
  margin-bottom: 1.5rem;
  line-height: 1;
  transition: color 0.3s ease;

  div:hover > & {
    color: ${colors.primary};
  }

  @media (max-width: 768px) {
    font-size: 1.8rem;
    margin-bottom: 1rem;
    color: ${colors.primary};
  }
`;

const eventListStyle = css`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  width: 100%;

  .event-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.4rem;

    @media (max-width: 768px) {
      align-items: flex-start;
      flex-direction: column;
      gap: 0.3rem;
    }
  }

  .event-date {
    font-size: 0.95rem;
    font-weight: 700;
    color: ${colors.gray[400]};
    letter-spacing: 0.05em;
  }

  .event-text {
    font-size: 1.1rem;
    font-weight: 600;
    color: ${colors.gray[700]};
    line-height: 1.4;
    word-break: keep-all;
    white-space: pre-line;
  }
`;

/* 🎯 PRESENT 전용 스타일 커스텀 */
const presentCardStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;

  @media (max-width: 768px) {
    align-items: flex-start;
    text-align: left;
    padding-left: 25px;
    border-left: 2px dashed ${colors.primary}; /* 현재 진행형 느낌을 위해 점선 처리 */
  }
`;

const presentTimelineDotStyle = css`
  width: 14px;
  height: 14px;
  background-color: ${colors.primary};
  border-radius: 50%;
  margin-bottom: 1.5rem;
  box-shadow: 0 0 0 6px ${colors.white};
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  .pulse-core {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: ${colors.primary};
    border-radius: 50%;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
      opacity: 0.8;
    }
    100% {
      transform: scale(2.8);
      opacity: 0;
    }
  }

  @media (max-width: 768px) {
    position: absolute;
    left: -8px;
    top: 6px;
    margin-bottom: 0;
  }
`;

const presentYearTitleStyle = css`
  font-size: 2.2rem;
  font-weight: 900;
  color: ${colors.primary};
  letter-spacing: 0.02em;
  margin-bottom: 1.5rem;
  line-height: 1;

  @media (max-width: 768px) {
    font-size: 1.8rem;
    margin-bottom: 1rem;
  }
`;

const presentEventListStyle = css`
  width: 100%;
  .present-text {
    font-size: 1.05rem;
    font-weight: 600;
    color: ${colors.primary};
    line-height: 1.5;
    word-break: keep-all;
    white-space: pre-line;
    opacity: 0.85;
  }
`;

/* 🧭 네비게이션 스타일 */
const asideStyle = css`
  position: fixed;
  right: 40px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  @media (max-width: 1024px) {
    display: none;
  }
`;

const navLinkStyle = (isActive: boolean) => css`
  font-size: 0.7rem;
  text-decoration: none;
  color: ${isActive ? colors.primary : colors.gray[400]};
  font-weight: ${isActive ? "bold" : "normal"};
  transition: all 0.4s ease;
  text-align: right;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  letter-spacing: 0.05em;
  &::after {
    content: "";
    width: ${isActive ? "30px" : "10px"};
    height: 1px;
    background: ${isActive ? colors.primary : colors.gray[300]};
    transition: all 0.4s ease;
  }
`;
