/** @jsxImportSource @emotion/react */
"use client";

import { css } from "@emotion/react";
import { colors } from "@/src/styles/colors";
import { data_organization } from "@/public/data/organization";
import Link from "next/link";
import { usePathname } from "next/navigation";
import PageSlogan from "@/src/components/text/PageSlogan";

export default function CompanyOrganizationPage() {
  const pathname = usePathname();

  return (
    <div css={orgPageWrapperStyle}>
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
        topLabel="ORGANIZATION"
        title={
          <>
            Efficient <span className="outline">Expert</span>{" "}
            <span className="accent">Network.</span>
          </>
        }
        description="전문적인 의사소통과 유기적인 시스템으로 신속하고 정확한 공간 솔루션을 도출합니다."
      />

      <section css={orgContentSectionStyle}>
        <div css={containerStyle}>
          {/* 1. 자리가 여유로울 때의 원본 가로 트리 구조 */}
          <div css={desktopTreeWrapper}>
            <div css={rootWrapperStyle}>
              <div css={nodeBoxStyle("root")}>{data_organization.name}</div>
              <div css={verticalLineStyle} />
            </div>

            <div css={deptGridStyle}>
              {data_organization.children?.map((dept) => (
                <div key={dept.id} css={deptColumnStyle}>
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

          {/* 2. 1200px 이하 태블릿 + 모바일 전체 통합 상시 전개형 레이아웃 */}
          <div css={responsiveListWrapper}>
            {/* 최상위 루트 본부 노드 */}
            <div css={listRootBox}>{data_organization.name}</div>

            {/* 세로형 리스트 컨테이너 */}
            <div css={listContainer}>
              {data_organization.children?.map((dept) => {
                const hasTeams = dept.children && dept.children.length > 0;

                return (
                  <div key={dept.id} css={deptRowCard}>
                    {/* 부서명 타이틀 */}
                    <div
                      css={[
                        deptRowTitleBase,
                        hasTeams ? deptRowTitleWithTeams : deptRowTitleAlone,
                      ]}
                    >
                      {dept.name}
                    </div>

                    {/* 소속 팀 리스트 */}
                    {hasTeams && (
                      <div css={teamGridStyle}>
                        {dept.children?.map((team) => (
                          <div key={team.id} css={teamNodeStyle}>
                            {team.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// --- Styles ---
const orgPageWrapperStyle = css`
  padding-top: 60px;
  padding-bottom: 120px;
  position: relative;
`;

const orgContentSectionStyle = css`
  width: 100%;
  background-color: ${colors.white};
`;

const containerStyle = css`
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 2rem 120px 2rem;
  @media (max-width: 600px) {
    padding: 40px 1.5rem;
  }
`;

const desktopTreeWrapper = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  @media (max-width: 1200px) {
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

const responsiveListWrapper = css`
  display: none;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;

  @media (max-width: 1200px) {
    display: flex;
    flex-direction: column;
  }
`;

const listRootBox = css`
  background-color: ${colors.primary};
  color: ${colors.white};
  padding: 16px;
  font-size: 1.05rem;
  font-weight: 700;
  border-radius: 6px;
  text-align: center;
  margin-bottom: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

const listContainer = css`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;

const deptRowCard = css`
  background-color: ${colors.white};
  border: 1px solid ${colors.gray[200]};
  border-radius: 6px;
  padding: 18px 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.01);
  box-sizing: border-box;
`;

const deptRowTitleBase = css`
  font-size: 1.05rem;
  font-weight: 800;
  color: ${colors.gray[800]};
  text-align: center;
`;

const deptRowTitleWithTeams = css`
  margin-bottom: 14px;
  padding-bottom: 10px;
  border-bottom: 1px solid ${colors.gray[200]};
`;

const deptRowTitleAlone = css`
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
`;

const teamGridStyle = css`
  display: grid;
  /* 💡 태블릿 규격(가로 여유)에서는 2열 배치, 모바일 등 화면이 좁아지면 무조건 1열로 딱 떨어지게 변경 */
  grid-template-columns: repeat(auto-fit, minmax(100%, 1fr));
  gap: 8px;
  width: 100%;
  box-sizing: border-box;

  @media (min-width: 480px) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
`;

const teamNodeStyle = css`
  background-color: ${colors.gray[100]};
  border: 1px solid ${colors.gray[100]};
  color: ${colors.gray[600]};
  padding: 11px 14px;
  font-size: 0.88rem;
  font-weight: 500;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  box-sizing: border-box;
  width: 100%;
`;

const asideStyle = css`
  position: fixed;
  right: 40px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  @media (max-width: 1200px) {
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
