/** @jsxImportSource @emotion/react */
"use client";

import { useState, useEffect, useMemo } from "react";
import { css } from "@emotion/react";
import { motion, Variants, AnimatePresence } from "framer-motion"; 
import { useRouter } from "next/navigation";
import { colors } from "@/src/styles/colors";
import PageTitle from "@/src/components/text/PageTitle";
import ProjectListCard from "@/src/components/project/ProjectListCard";

interface Project {
  id: number;
  title: string;
  subTitle: string;
  saveNames: string | null;
}

export default function ProjectPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  const [itemsPerPage, setItemsPerPage] = useState(9);

  const handleAdminAccess = () => {
    router.push("/login"); 
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1024) {
        setItemsPerPage(10);
      } else {
        setItemsPerPage(9);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const revealVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.215, 0.61, 0.355, 1] },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/projects", { cache: 'no-store' });
        const data = await res.json();
        const sortedData = data.sort((a: Project, b: Project) => b.id - a.id);
        setProjects(sortedData);
        setIsLoaded(true);
      } catch (err) {
        console.error("Data Fetch Error:", err);
      }
    };
    fetchData();
  }, []);

  const currentItems = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return projects.slice(indexOfFirstItem, indexOfLastItem);
  }, [projects, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(projects.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 300, behavior: 'smooth' }); 
  };

  // ✨ 추가: 마우스 우클릭 콘텍스트 메뉴를 원천 차단하는 핸들러
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <div css={projectPageContainerStyle}>
      <PageTitle
        title={"PROJECTS"}
        subTitle={"선준아이디가 제안하는 프리미엄 공간 디자인 포트폴리오입니다."}
      />

      <main css={mainContentStyle}>
        <div css={contentWrapperStyle}>
          <section css={projectIntroSectionStyle}>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              css={introContentStyle}
            >
              <motion.span css={topLabelStyle} variants={revealVariants}>
                ARCHIVE
              </motion.span>
              <motion.h2 css={bigSloganStyle} variants={revealVariants}>
                Crafting <span className="outline">Inspiring</span>{" "}
                <span className="accent">
                  Spaces
                  <span 
                    onDoubleClick={handleAdminAccess}
                    style={{ 
                      userSelect: 'none', 
                      cursor: 'default',
                      display: 'inline-block',
                      paddingRight: '10px'
                    }}
                  >
                    .
                  </span>
                </span>
              </motion.h2>
            </motion.div>
          </section>

          {isLoaded && (
            <>
              <AnimatePresence mode="wait">
                <motion.section 
                  key={`${currentPage}-${itemsPerPage}`}
                  css={gridSectionStyle}
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  exit={{ opacity: 0, y: -20 }}
                  onContextMenu={handleContextMenu} // ✨ 리스트 섹션 영역 우클릭 메뉴 차단
                >
                  {currentItems.length > 0 ? (
                    /* ✨ 하위 이미지 카드들의 무단 드래그 및 복사를 막기 위한 프로텍터 CSS 주입 */
                    <div css={[gridContainerStyle, imageProtectorStyle]}>
                      {currentItems.map((project) => (
                        <motion.div key={project.id} variants={revealVariants}>
                          <ProjectListCard project={project} />
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div css={noDataStyle}>프로젝트를 준비 중입니다.</div>
                  )}
                </motion.section>
              </AnimatePresence>

              {totalPages > 1 && (
                <div css={paginationContainerStyle}>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                    <button
                      key={num}
                      onClick={() => handlePageChange(num)}
                      css={paginationButtonStyle(num === currentPage)}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

// --- Styles ---

const projectPageContainerStyle = css`
  background-color: ${colors.white};
  min-height: 100vh;
  padding-top: 90px;
`;

const mainContentStyle = css`
  padding-bottom: 100px;
`;

const contentWrapperStyle = css`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 50px;
  @media (max-width: 768px) { padding: 0 20px; }
`;

const projectIntroSectionStyle = css`
  padding: 6rem 0 4rem 0;
  text-align: center;
`;

const introContentStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const topLabelStyle = css`
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.5em;
  color: ${colors.accent || '#c5a47e'};
  margin-bottom: 1.5rem;
`;

const bigSloganStyle = css`
  font-size: 5rem;
  font-weight: 900;
  line-height: 1.1;
  color: ${colors.primary || '#111'};
  .outline {
    color: transparent;
    -webkit-text-stroke: 1.5px ${colors.primary || '#111'};
    opacity: 0.3;
  }
  .accent {
    color: ${colors.accent || '#c5a47e'};
  }
  @media (max-width: 768px) { font-size: 2.8rem; }
`;

const gridSectionStyle = css`
  margin-top: 20px;
`;

const gridContainerStyle = css`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 80px 40px;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 60px 30px;
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 50px;
  }
`;

/* ✨ 이미지 무단 복사 및 다운로드 제한 가드 스타일 
  - 카드 내의 모든 이미지 자식 요소들의 포인터 이벤트를 무력화하고 드래그 선택을 금지합니다.
*/
const imageProtectorStyle = css`
  user-select: none;
  -webkit-user-drag: none;
  
  img {
    pointer-events: none; /* 이미지 우클릭 컨텍스트 방지 및 롱탭 차단 */
    -webkit-user-drag: none; /* 이미지 자체 드래그앤드롭 차단 */
  }
`;

const noDataStyle = css`
  text-align: center;
  padding: 100px 0;
  color: ${colors.gray[400]};
`;

const paginationContainerStyle = css`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-top: 100px;
`;

const paginationButtonStyle = (isActive: boolean) => css`
  width: 40px;
  height: 40px;
  border: none;
  background: none;
  font-size: 1rem;
  font-weight: ${isActive ? "700" : "400"};
  color: ${isActive ? colors.primary : colors.gray[400]};
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;

  &::after {
    content: "";
    position: absolute;
    bottom: 5px;
    left: 50%;
    transform: translateX(-50%);
    width: ${isActive ? "15px" : "0"};
    height: 2px;
    background-color: ${colors.primary};
    transition: width 0.3s ease;
  }

  &:hover {
    color: ${colors.primary};
  }
`;