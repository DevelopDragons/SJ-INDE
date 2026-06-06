/** @jsxImportSource @emotion/react */
"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { css } from "@emotion/react";
import { motion, Variants, AnimatePresence } from "framer-motion"; 
import { useRouter } from "next/navigation";
import { colors } from "@/src/styles/colors";
import PageTitle from "@/src/components/text/PageTitle";
import ProjectListCard from "@/src/components/project/ProjectListCard";

// 1. 안전한 인터페이스 선언
interface Project {
  id: number;
  title: string;
  subTitle: string;
  saveNames: string | null;
}

export default function ProjectPage() {
  const router = useRouter();
  
  // 2. 상태 관리 표준화
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(9);
  
  // 검색용 투트랙 상태 분리
  const [tempSearchTerm, setTempSearchTerm] = useState<string>(""); 
  const [searchTerm, setSearchTerm] = useState<string>(""); 

  // 관리자 접근 라우팅 핸들러
  const handleAdminAccess = useCallback(() => {
    router.push("/login"); 
  }, [router]);

  // 3. 반응형 다이나믹 아이템 개수 조정 (안전한 윈도우 스크린 체크)
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== "undefined") {
        setItemsPerPage(window.innerWidth <= 1024 ? 10 : 9);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 4. Framer Motion 애니메이션 기하학 변수 선언
  const revealVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.215, 0.61, 0.355, 1] },
    },
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  // 5. 비동기 백엔드 API 데이터 페칭
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const res = await fetch("/api/projects", { cache: 'no-store' });
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();
        
        if (isMounted && Array.isArray(data)) {
          const sortedData = [...data].sort((a: Project, b: Project) => b.id - a.id);
          setProjects(sortedData);
          setIsLoaded(true);
        }
      } catch (err) {
        console.error("Data Fetch Error:", err);
      }
    };
    fetchData();
    return () => { isMounted = false; };
  }, []);

  // 6. 공백/띄어쓰기 지능형 무시 및 대소문자 예외 처리 비즈니스 로직
  const filteredProjects = useMemo(() => {
    if (!searchTerm || !searchTerm.trim()) return projects;

    const normalizedSearch = searchTerm.replace(/\s+/g, "").toLowerCase();

    return projects.filter((project) => {
      if (!project.title) return false;
      const normalizedTitle = project.title.replace(/\s+/g, "").toLowerCase();
      return normalizedTitle.includes(normalizedSearch);
    });
  }, [projects, searchTerm]);

  // 7. 파생 데이터 메모이제이션 (페이지네이션 슬라이싱)
  const currentItems = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredProjects.slice(indexOfFirstItem, indexOfLastItem);
  }, [filteredProjects, currentPage, itemsPerPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredProjects.length / itemsPerPage);
  }, [filteredProjects.length, itemsPerPage]);

  // 8. 기능 확장형 유저 인터랙션 제어 핸들러
  const executeSearch = () => {
    setSearchTerm(tempSearchTerm);
    setCurrentPage(1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      executeSearch();
    }
  };

  const handleClearSearch = () => {
    setTempSearchTerm("");
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 300, behavior: 'smooth' }); 
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <div css={projectPageContainerStyle}>
      <PageTitle
        title="PROJECTS"
        subTitle="선준아이디가 제안하는 프리미엄 공간 디자인 포트폴리오입니다."
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

          {/* 깔끔하게 정돈된 테마 검색 바 */}
          <section css={searchSectionStyle}>
            <div css={searchContainerStyle}>
              <input
                type="text"
                placeholder="프로젝트 제목으로 검색"
                value={tempSearchTerm}
                onChange={(e) => setTempSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                css={searchInputStyle}
              />
              <button css={searchIconButtonStyle} onClick={executeSearch} aria-label="Search">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" fill="currentColor"/>
                </svg>
              </button>
              {tempSearchTerm && (
                <button css={clearButtonStyle} onClick={handleClearSearch} aria-label="Clear Search">
                  &times;
                </button>
              )}
            </div>
          </section>

          {isLoaded && (
            <>
              <AnimatePresence mode="wait">
                <motion.section 
                  key={`${currentPage}-${itemsPerPage}-${searchTerm}`}
                  css={gridSectionStyle}
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  exit={{ opacity: 0, y: -20 }}
                  onContextMenu={handleContextMenu}
                >
                  {currentItems.length > 0 ? (
                    <div css={[gridContainerStyle, imageProtectorStyle]}>
                      {currentItems.map((project) => (
                        <motion.div key={project.id} variants={revealVariants}>
                          <ProjectListCard project={project} />
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div css={noDataStyle}>검색 결과에 부합하는 프로젝트가 없습니다.</div>
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

// --- 안정성이 확보된 가독성 우선 스펙트럼 CSS Styles ---

const projectPageContainerStyle = css`
  background-color: ${colors?.white || '#ffffff'};
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
  padding: 6rem 0 2rem 0;
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
  color: ${colors?.accent || '#c5a47e'};
  margin-bottom: 1.5rem;
`;

const bigSloganStyle = css`
  font-size: 5rem;
  font-weight: 900;
  line-height: 1.1;
  color: ${colors?.primary || '#111111'};
  .outline {
    color: transparent;
    -webkit-text-stroke: 1.5px ${colors?.primary || '#111111'};
    opacity: 0.3;
  }
  .accent {
    color: ${colors?.accent || '#c5a47e'};
  }
  @media (max-width: 768px) { font-size: 2.8rem; }
`;

const searchSectionStyle = css`
  display: flex;
  justify-content: center;
  margin-bottom: 5rem;
`;

const searchContainerStyle = css`
  position: relative;
  width: 100%;
  max-width: 500px;
  display: flex;
  align-items: center;
`;

const searchInputStyle = css`
  width: 100%;
  padding: 14px 55px 14px 20px;
  font-size: 0.95rem;
  
  /* 자연스러운 순수 딥블랙 톤으로 텍스트 색상 바인딩 */
  color: ${colors?.gray?.[800] || '#222222'}; 
  background-color: ${colors?.white || '#ffffff'};
  
  /* 포커싱 전 기본 상태부터 선명한 테마 포인트 컬러 테두리 부여 */
  border: 1.5px solid ${colors?.accent || '#c5a47e'};
  border-radius: 50px;
  outline: none;
  transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
  letter-spacing: -0.02em;

  &::placeholder {
    color: ${colors?.gray?.[400] || '#aaaaaa'};
  }

  &:hover {
    border-color: ${colors?.accent || '#c5a47e'};
    box-shadow: 0 2px 10px rgba(197, 164, 126, 0.08);
  }

  &:focus {
    border-color: ${colors?.accent || '#c5a47e'};
    box-shadow: 0 4px 20px rgba(197, 164, 126, 0.16);
  }
`;

const searchIconButtonStyle = css`
  position: absolute;
  right: 18px;
  background: none;
  border: none;
  color: ${colors?.accent || '#c5a47e'};
  opacity: 0.75;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 4px;
  transition: all 0.3s ease;

  &:hover {
    opacity: 1;
    transform: scale(1.05);
  }

  input:focus + & {
    opacity: 1;
  }
`;

const clearButtonStyle = css`
  position: absolute;
  right: 48px;
  background: none;
  border: none;
  font-size: 1.3rem;
  color: ${colors?.gray?.[400] || '#aaaaaa'};
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: ${colors?.primary || '#111111'};
  }
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

const imageProtectorStyle = css`
  user-select: none;
  -webkit-user-drag: none;
  
  img {
    pointer-events: none;
    -webkit-user-drag: none;
  }
`;

const noDataStyle = css`
  text-align: center;
  padding: 100px 0;
  color: ${colors?.gray?.[400] || '#aaaaaa'};
  font-size: 1.1rem;
  letter-spacing: -0.02em;
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
  color: ${isActive ? (colors?.primary || '#111111') : (colors?.gray?.[400] || '#aaaaaa')};
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
    background-color: ${colors?.primary || '#111111'};
    transition: width 0.3s ease;
  }

  &:hover {
    color: ${colors?.primary || '#111111'};
  }
`;