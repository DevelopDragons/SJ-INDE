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
  const deptCount = data_organization.children?.length || 1;

  return (
    <div css={orgPageWrapperStyle}>
      {/* 🧭 우측 서브페이지 네비게이션 추가 */}
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
          {/* 1. 데스크탑/태블릿용 트리 구조 */}
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

          {/* 2. 모바일용 카드 레이아웃 */}
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

// --- Styles ---
const orgPageWrapperStyle = css`
  padding-top: 60px;
  padding-bottom: 120px;
  position: relative;
`;

const orgContentSectionStyle = css`
  width: 100%;
  background-color: ${colors.white};
  overflow-x: auto;
`;

const containerStyle = css`
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 2rem 120px 2rem;
  @media (max-width: 600px) {
    padding: 40px 1rem;
  }
`;

const desktopTreeWrapper = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-width: 800px;
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

/* 🧭 네비게이션 공통 스타일 */
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
