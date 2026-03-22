/** @jsxImportSource @emotion/react */
"use client";

import { css } from "@emotion/react";
import { colors } from "@/src/styles/colors";
import PageTitle from "@/src/components/text/PageTitle";
import { data_organization } from "@/public/data/organization";

export default function CompanyOrganizationPage() {
  const deptCount = data_organization.children?.length || 1;

  return (
    <div css={orgPageWrapperStyle}>
      <PageTitle
        title={"ORGANIZATION"}
        subTitle={"전문적인 협업 시스템으로 최상의 공간을 만듭니다"}
      />

      <section css={orgContentSectionStyle}>
        <div css={containerStyle}>
          {/* 1. 데스크탑/태블릿용 트리 구조 (601px 이상) */}
          <div css={desktopTreeWrapper}>
            <div css={rootWrapperStyle}>
              <div css={nodeBoxStyle("root")}>{data_organization.name}</div>
              <div css={verticalLineStyle} />
            </div>

            {/* 수평선이 포함된 그리드 */}
            <div css={deptGridStyle}>
              {data_organization.children?.map((dept) => (
                <div key={dept.id} css={deptColumnStyle}>
                  {/* 각 부서 상단 수직선 */}
                  <div css={verticalLineShortStyle} />
                  <div css={nodeBoxStyle("department")}>{dept.name}</div>

                  {dept.children && (
                    <div css={teamGroupStyle}>
                      {dept.children.map((team) => (
                        <div key={team.id} css={nodeBoxStyle("team")}>
                          {team.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 2. 모바일용 카드 레이아웃 (600px 이하) */}
          <div css={mobileCardWrapper}>
            <div css={mobileRootBox}>{data_organization.name}</div>
            <div css={mobileGridStyle}>
              {data_organization.children?.map((dept) => (
                <div key={dept.id} css={mobileDeptCard}>
                  <div css={mobileDeptTitle}>{dept.name}</div>
                  <div css={mobileDivider} />
                  <div css={mobileTeamList}>
                    {dept.children?.map((team) => (
                      <span key={team.id}>{team.name}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// --- 공통 Styles ---

const orgPageWrapperStyle = css`
  padding-top: 80px;
`;

const orgContentSectionStyle = css`
  width: 100%;
  background-color: ${colors.white};
  overflow-x: auto; /* 트리 구조일 때 최소 너비 미달 시 스크롤 보장 */
`;

const containerStyle = css`
  max-width: 1400px;
  margin: 0 auto;
  padding: 80px 2rem 120px 2rem;
  @media (max-width: 600px) {
    padding: 40px 1rem;
  }
`;

// --- [데스크탑 전용] 트리 구조 스타일 최적화 ---

const desktopTreeWrapper = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-width: 800px; /* 트리 구조 유지 최소 너비 */
  @media (max-width: 1024px) {
    display: none;
  }
`;

const rootWrapperStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 2;
`;

const deptGridStyle = css`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(160px, 1fr);
  gap: 20px;
  width: 100%;
  position: relative;

  /* 수평선: 전체 너비에 긋기 */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background-color: ${colors.gray[300]};
    z-index: 0;
  }
`;

const deptColumnStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 1;

  /* 첫 번째 부서의 왼쪽 수평선 제거 (마스킹) */
  &:first-of-type::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 50%;
    height: 2px;
    background-color: ${colors.white};
    z-index: 1;
  }

  /* 마지막 부서의 오른쪽 수평선 제거 (마스킹) */
  &:last-of-type::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 50%;
    height: 2px;
    background-color: ${colors.white};
    z-index: 1;
  }
`;

const nodeBoxStyle = (type: "root" | "department" | "team") => css`
  width: ${type === "root" ? "240px" : "100%"};
  padding: 1rem;
  background-color: ${type === "root" ? colors.primary : colors.white};
  color: ${type === "root" ? colors.white : colors.gray[800]};
  border: 2px solid ${type === "root" ? colors.primary : colors.gray[200]};
  text-align: center;
  font-weight: 700;
  border-radius: 4px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  white-space: nowrap;
  word-break: keep-all;
`;

/* 선 두께를 2px로 고정하여 끊김 현상 방지 */
const verticalLineStyle = css`
  width: 2px;
  height: 50px;
  background-color: ${colors.gray[300]};
`;

const verticalLineShortStyle = css`
  width: 2px;
  height: 30px;
  background-color: ${colors.gray[300]};
`;

const teamGroupStyle = css`
  margin-top: 15px;
  width: 100%;
  padding: 12px;
  background-color: ${colors.gray[100]};
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

// --- [모바일 전용] 스타일 (기존과 동일하되 시인성 강화) ---

const mobileCardWrapper = css`
  display: none;
  width: 100%;
  @media (max-width: 1024px) {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
`;

const mobileRootBox = css`
  background-color: ${colors.primary};
  color: ${colors.white};
  padding: 18px;
  text-align: center;
  font-size: 1.1rem;
  font-weight: 700;
  border-radius: 4px;
`;

const mobileGridStyle = css`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`;

const mobileDeptCard = css`
  background-color: ${colors.white};
  border: 1px solid ${colors.gray[200]};
  padding: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 4px;
`;

const mobileDeptTitle = css`
  font-weight: 700;
  color: ${colors.gray[800]};
  font-size: 0.95rem;
`;
const mobileDivider = css`
  width: 20px;
  height: 1px;
  background-color: ${colors.gray[300]};
  margin: 8px 0;
`;
const mobileTeamList = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  font-size: 0.8rem;
  color: ${colors.gray[600]};
`;
