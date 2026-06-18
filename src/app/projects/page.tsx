/** @jsxImportSource @emotion/react */
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { css } from "@emotion/react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { colors } from "@/src/styles/colors";
import ProjectListCard from "@/src/components/project/ProjectListCard";

interface Project {
  id: number;
  title: string;
  subTitle: string;
  saveNames: string | null;
  uploadCheck: number; // ✅ 추가된 노출 제어 필드
}



export default function ProjectPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(9);

  const [tempSearchTerm, setTempSearchTerm] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

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

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const res = await fetch("/api/projects", { cache: "no-store" });
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();

        console.log(data);

        if (isMounted && Array.isArray(data)) {
          const sortedData = [...data].sort(
            (a: Project, b: Project) => b.id - a.id,
          );
          setProjects(sortedData);
          setIsLoaded(true);
        }
      } catch (err) {
        console.error("Data Fetch Error:", err);
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  // 💡 노출 제어 상태(uploadCheck === 1) 조건 필터링 반영
  const filteredProjects = useMemo(() => {
    // 1. 관리자 화면에서 '노출중(1)' 상태로 지정한 프로젝트만 1차 추출
    const visibleProjects = projects.filter((project) => project.uploadCheck === 1);

    // 2. 검색어가 없다면 노출 가능한 프로젝트 전체 반환
    if (!searchTerm || !searchTerm.trim()) return visibleProjects;

    // 3. 검색어가 입력되었다면 노출 가능한 프로젝트 내에서 타이틀 매칭 검색 수행
    const normalizedSearch = searchTerm.replace(/\s+/g, "").toLowerCase();
    return visibleProjects.filter((project) => {
      if (!project.title) return false;
      const normalizedTitle = project.title.replace(/\s+/g, "").toLowerCase();
      return normalizedTitle.includes(normalizedSearch);
    });
  }, [projects, searchTerm]);

  const currentItems = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredProjects.slice(indexOfFirstItem, indexOfLastItem);
  }, [filteredProjects, currentPage, itemsPerPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredProjects.length / itemsPerPage);
  }, [filteredProjects.length, itemsPerPage]);

  const paginationRange = useMemo(() => {
    if (totalPages <= 10) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const currentGroup = Math.ceil(currentPage / 5);
    const startPage = (currentGroup - 1) * 5 + 1;
    const endPage = Math.min(startPage + 4, totalPages);

    const range = [];
    for (let i = startPage; i <= endPage; i++) {
      range.push(i);
    }
    return range;
  }, [totalPages, currentPage]);

  const executeSearch = () => {
    setSearchTerm(tempSearchTerm);
    setCurrentPage(1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") executeSearch();
  };

  const handleClearSearch = () => {
    setTempSearchTerm("");
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 300, behavior: "smooth" });
    }
  };

  return (
    <div css={projectPageContainerStyle}>
      <section css={contentSectionStyle}>
        <div css={contentWrapperStyle}>
          {/* 메인 슬로건 섹션 */}
          <div css={projectIntroSectionStyle}>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              css={introContentStyle}
            >
              <motion.span css={topLabelStyle} variants={revealVariants}>
                PROJECTS
              </motion.span>
              <motion.h2 css={bigSloganStyle} variants={revealVariants}>
                <span className="accent">Crafting</span>{" "}
                <span className="outline">Inspiring</span>{" "}
                <span className="accent">Spaces.</span>
              </motion.h2>
            </motion.div>
          </div>

          {/* 검색 섹션 */}
          <div css={searchSectionStyle}>
            <div css={searchContainerStyle}>
              <input
                type="text"
                placeholder="프로젝트 제목으로 검색"
                value={tempSearchTerm}
                onChange={(e) => setTempSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                css={searchInputStyle}
              />
              <button
                css={searchIconButtonStyle}
                onClick={executeSearch}
                aria-label="Search"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
                    fill="currentColor"
                  />
                </svg>
              </button>
              {tempSearchTerm && (
                <button
                  css={clearButtonStyle}
                  onClick={handleClearSearch}
                  aria-label="Clear Search"
                >
                  &times;
                </button>
              )}
            </div>
          </div>

          {isLoaded && (
            <>
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${currentPage}-${itemsPerPage}-${searchTerm}`}
                  css={gridSectionStyle}
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  exit={{ opacity: 0, y: -20 }}
                  onContextMenu={(e) => e.preventDefault()}
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
                    <div css={noDataStyle}>
                      검색 결과에 부합하는 프로젝트가 없습니다.
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* 페이지네이션 */}
              {totalPages > 1 && (
                <div css={paginationContainerStyle}>
                  {totalPages > 10 && (
                    <button
                      onClick={() => handlePageChange(1)}
                      disabled={currentPage === 1}
                      css={arrowNavButtonStyle}
                      aria-label="First Page"
                    >
                      &laquo;
                    </button>
                  )}

                  <button
                    onClick={() =>
                      handlePageChange(Math.max(currentPage - 1, 1))
                    }
                    disabled={currentPage === 1}
                    css={arrowNavButtonStyle}
                    aria-label="Previous Page"
                  >
                    &lsaquo;
                  </button>

                  {paginationRange.map((num) => (
                    <button
                      key={num}
                      onClick={() => handlePageChange(num)}
                      css={paginationButtonStyle(num === currentPage)}
                    >
                      {num}
                    </button>
                  ))}

                  <button
                    onClick={() =>
                      handlePageChange(Math.min(currentPage + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    css={arrowNavButtonStyle}
                    aria-label="Next Page"
                  >
                    &rsaquo;
                  </button>

                  {totalPages > 10 && (
                    <button
                      onClick={() => handlePageChange(totalPages)}
                      disabled={currentPage === totalPages}
                      css={arrowNavButtonStyle}
                      aria-label="Last Page"
                    >
                      &raquo;
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}

// --- Styles ---

const projectPageContainerStyle = css`
  padding-top: 80px;
`;

const contentSectionStyle = css`
  padding-bottom: 160px;
  background-color: ${colors.white};
`;

const contentWrapperStyle = css`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 60px;
  @media (max-width: 768px) {
    padding: 0 28px;
  }
`;

const projectIntroSectionStyle = css`
  padding: 6rem 0 3.5rem 0;
  text-align: center;
  @media (max-width: 768px) {
    padding: 4rem 0 2.5rem 0;
  }
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
  color: ${colors?.accent || "#b13241"};
  margin-bottom: 1.5rem;
`;

const bigSloganStyle = css`
  font-size: 5rem;
  font-weight: 900;
  line-height: 1.1;
  color: ${colors.primary};
  margin-bottom: 3rem;
  letter-spacing: -0.03em;

  .outline {
    color: transparent;
    -webkit-text-stroke: 2px ${colors.primary};
    opacity: 0.4;
    transition: opacity 0.3s ease;

    &:hover {
      opacity: 0.8;
    }
  }

  .accent {
    color: ${colors.primary};
  }

  @media (max-width: 768px) {
    font-size: 2.8rem;
    .outline {
      -webkit-text-stroke: 1px ${colors.primary};
    }
  }
`;

const searchSectionStyle = css`
  display: flex;
  justify-content: center;
  padding-bottom: 6.5rem;
  @media (max-width: 768px) {
    padding-bottom: 4rem;
  }
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
  color: #222222;
  background-color: ${colors.white};
  border: 1.5px solid ${colors?.primary || "#9e0012"};
  border-radius: 50px;
  outline: none;
  transition: all 0.3s ease;
  letter-spacing: -0.02em;

  &::placeholder {
    color: ${colors?.gray?.[400] || "#aaaaaa"};
  }
  &:hover {
    box-shadow: 0 2px 10px rgba(158, 0, 18, 0.08);
  }
  &:focus {
    box-shadow: 0 4px 20px rgba(158, 0, 18, 0.16);
  }
`;

const searchIconButtonStyle = css`
  position: absolute;
  right: 18px;
  background: none;
  border: none;
  color: ${colors?.primary || "#9e0012"};
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
`;

const clearButtonStyle = css`
  position: absolute;
  right: 48px;
  background: none;
  border: none;
  font-size: 1.3rem;
  color: ${colors?.gray?.[400] || "#aaaaaa"};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    color: ${colors?.black || "#111111"};
  }
`;

const gridSectionStyle = css`
  margin-top: 35px;
`;

const gridContainerStyle = css`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 90px 45px;
  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 70px 35px;
  }
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 55px;
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
  padding: 120px 0;
  color: ${colors?.gray?.[400] || "#aaaaaa"};
  font-size: 1.1rem;
  letter-spacing: -0.02em;
`;

const paginationContainerStyle = css`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 140px;
  @media (max-width: 768px) {
    margin-top: 90px;
  }
`;

const paginationButtonStyle = (isActive: boolean) => css`
  width: 40px;
  height: 40px;
  border: none;
  background: none;
  font-size: 1rem;
  font-weight: ${isActive ? "700" : "400"};
  color: ${isActive
    ? colors?.primary || "#9e0012"
    : colors?.gray?.[400] || "#aaaaaa"};
  cursor: pointer;
  position: relative;
  transition: all 0.25s ease-in-out;

  &::after {
    content: "";
    position: absolute;
    bottom: 5px;
    left: 50%;
    transform: translateX(-50%);
    width: ${isActive ? "15px" : "0"};
    height: 2px;
    background-color: ${colors?.primary || "#9e0012"};
    transition: width 0.25s ease-in-out;
  }
  &:hover {
    color: ${colors?.primary || "#9e0012"};
  }
`;

const arrowNavButtonStyle = css`
  width: 40px;
  height: 40px;
  border: none;
  background: none;
  font-size: 1.2rem;
  color: ${colors?.gray?.[500] || "#888888"};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  &:hover:not(:disabled) {
    color: ${colors?.primary || "#9e0012"};
    transform: scale(1.1);
  }
  &:disabled {
    color: ${colors?.gray?.[200] || "#e0e0e0"};
    cursor: not-allowed;
    opacity: 0.5;
  }
`;