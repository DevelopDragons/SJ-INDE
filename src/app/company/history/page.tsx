/** @jsxImportSource @emotion/react */
"use client";

import { css } from "@emotion/react";
import { colors } from "@/src/styles/colors";
import PageTitle from "@/src/components/text/PageTitle";
import { data_history } from "@/public/data/history";

export default function CompanyHistoryPage() {
  let globalIndex = 0;

  return (
    <div css={historyPageWrapperStyle}>
      <PageTitle title={"HISTORY"} subTitle={"회사 연혁"} />

      <section css={historyContentSectionStyle}>
        <div css={containerStyle}>
          {/* 중앙 가이드 라인 */}
          <div css={centerLineStyle} />

          {data_history.map((yearGroup) => {
            const isPresent = yearGroup.year === "PRESENT";
            // PRESENT이거나 이벤트가 없는 경우 배지만 렌더링하기 위한 조건
            const hasEvents = yearGroup.events && yearGroup.events.length > 0;

            return (
              <div key={yearGroup.year} css={yearBlockStyle(isPresent)}>
                {/* 연도 표시기 (PRESENT 포함) */}
                <div css={yearBadgeStyle(isPresent)}>{yearGroup.year}</div>

                {/* 이벤트가 있을 때만 렌더링 */}
                {hasEvents &&
                  yearGroup.events.map((event, idx) => {
                    const isLeft = globalIndex % 2 === 0;
                    globalIndex++;

                    return (
                      <div key={idx} css={eventRowStyle(isLeft)}>
                        <div className="content-box">
                          <span className="date-label">
                            {String(event.month).padStart(2, "0")}.
                            {String(event.day).padStart(2, "0")}
                          </span>
                          <p className="event-text">{event.content}</p>
                        </div>
                        <div className="center-dot" />
                      </div>
                    );
                  })}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

// --- Styles ---

const historyPageWrapperStyle = css`
  padding-top: 80px;
`;

const historyContentSectionStyle = css`
  width: 100%;
  background-color: ${colors.white};
  overflow: hidden;
  padding-top: 60px;
  padding-bottom: 120px;
`;

const containerStyle = css`
  max-width: 1100px;
  margin: 0 auto;
  padding: 80px 2rem;
  position: relative;
`;

const centerLineStyle = css`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 0;
  bottom: 0;
  width: 1px;
  background: linear-gradient(
    to bottom,
    rgba(224, 224, 224, 0) 0%,
    ${colors.gray[200]} 10%,
    ${colors.gray[200]} 90%,
    rgba(224, 224, 224, 0) 100%
  );
  @media (max-width: 768px) {
    left: 40px;
  }
`;

const yearBlockStyle = (isPresent: boolean) => css`
  position: relative;
  /* PRESENT일 때는 아래 간격을 줄여서 마침표 느낌을 줌 */
  margin-bottom: ${isPresent ? "80px" : "120px"};
  display: flex;
  flex-direction: column;
  align-items: center;
  &:last-child {
    margin-bottom: 0;
  }
  @media (max-width: 768px) {
    align-items: flex-start;
    padding-left: 10px;
  }
`;

const yearBadgeStyle = (isPresent: boolean) => css`
  background-color: ${isPresent ? colors.primary : colors.white};
  color: ${isPresent ? colors.white : colors.primary};
  padding: 10px 32px;
  border: 2px solid ${colors.primary};
  border-radius: 4px; /* 샤프한 사각형이 더 트렌디함 */
  font-size: 1.3rem;
  font-weight: 900;
  margin-bottom: ${isPresent
    ? "0"
    : "60px"}; /* PRESENT는 이벤트가 없으므로 아래 간격 제거 */
  z-index: 2;
  letter-spacing: 0.1em;
  box-shadow: ${isPresent ? "0 10px 25px rgba(0, 102, 255, 0.2)" : "none"};
`;

const eventRowStyle = (isLeft: boolean) => css`
  display: flex;
  width: 100%;
  justify-content: ${isLeft ? "flex-start" : "flex-end"};
  margin-bottom: 60px;
  position: relative;
  &:last-child {
    margin-bottom: 0;
  }

  .content-box {
    width: 44%;
    padding: 30px 0; /* 배경색을 빼고 텍스트 위주로 세련되게 변경 */
    text-align: ${isLeft ? "right" : "left"};

    .date-label {
      display: block;
      font-size: 1.1rem;
      font-weight: 800;
      color: ${colors.primary};
      margin-bottom: 12px;
      opacity: 0.8;
    }

    .event-text {
      font-size: 1.3rem;
      font-weight: 600;
      color: ${colors.gray[800]};
      line-height: 1.5;
      word-break: keep-all;
    }
  }

  .center-dot {
    position: absolute;
    left: 50%;
    top: 45px; /* 텍스트 첫 줄 높이에 맞춤 */
    transform: translateX(-50%);
    width: 10px;
    height: 10px;
    background-color: ${colors.primary};
    border-radius: 50%;
    z-index: 3;
    box-shadow: 0 0 0 6px ${colors.white};
  }

  @media (max-width: 768px) {
    justify-content: flex-start;
    padding-left: 60px;
    .content-box {
      width: 100%;
      text-align: left;
    }
    .center-dot {
      left: 30px;
      top: 15px;
    }
  }
`;
