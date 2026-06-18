/** @jsxImportSource @emotion/react */
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { css } from "@emotion/react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { colors } from "@/src/styles/colors";

interface Project {
  id: number;
  title: string;
  subTitle: string;
  saveNames: string | null;
  uploadCheck: number;
}

export default function AdminProjectCheckPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  // 데이터 패치
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const res = await fetch("/api/projects", { cache: "no-store" });
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();

        if (isMounted && Array.isArray(data)) {
          const sortedData = [...data].sort((a: Project, b: Project) => b.id - a.id);
          setProjects(sortedData);
          setIsLoaded(true);
          if (sortedData.length > 0) {
            setSelectedProject(sortedData[0]);
          }
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

  // 검색 필터링
  const filteredProjects = useMemo(() => {
    if (!searchTerm.trim()) return projects;
    const normalizedSearch = searchTerm.replace(/\s+/g, "").toLowerCase();
    return projects.filter((project) => {
      if (!project.title) return false;
      const normalizedTitle = project.title.replace(/\s+/g, "").toLowerCase();
      return normalizedTitle.includes(normalizedSearch);
    });
  }, [projects, searchTerm]);

  // 페이징 처리된 리스트
  const currentItems = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredProjects.slice(indexOfFirstItem, indexOfLastItem);
  }, [filteredProjects, currentPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredProjects.length / itemsPerPage);
  }, [filteredProjects.length]);

  // 토글 상태 변경 API 핸들러
  const handleToggleUpload = async (projectId: number, currentStatus: number) => {
    const nextStatus = currentStatus === 1 ? 0 : 1;
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uploadCheck: nextStatus }),
      });
      if (!res.ok) throw new Error("토글 상태 업데이트 실패");

      setProjects((prev) =>
        prev.map((p) => (p.id === projectId ? { ...p, uploadCheck: nextStatus } : p))
      );
      if (selectedProject && selectedProject.id === projectId) {
        setSelectedProject((prev) => prev ? { ...prev, uploadCheck: nextStatus } : null);
      }
    } catch (err) {
      console.error("Toggle Error:", err);
      alert("상태 변경 중 오류가 발생했습니다.");
    }
  };

  // 💡 수정 페이지와 동일하게 콤마(,) 기준 split 구조로 매핑
  const imageList = useMemo(() => {
    if (!selectedProject?.saveNames) return [];
    return selectedProject.saveNames
      .split(",")
      .map((name) => name.trim())
      .filter((name) => name.length > 0);
  }, [selectedProject]);

  return (
    <div css={adminPageContainerStyle}>
      <header css={adminHeaderStyle}>
        <h2>프로젝트 노출 관리 <span css={adminBadgeStyle}>Admin</span></h2>
        <p>사용자 화면에 노출할 프로젝트를 활성화/비활성화 할 수 있습니다.</p>
      </header>

      <div css={splitLayoutStyle}>
        {/* ================= 좌측: 프로젝트 리스트 구역 ================= */}
        <div css={leftListSectionStyle}>
          <div css={searchBoxStyle}>
            <input
              type="text"
              placeholder="프로젝트 제목 검색..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          {isLoaded && (
            <div css={listWrapperStyle}>
              {currentItems.length > 0 ? (
                currentItems.map((project) => {
                  const isSelected = selectedProject?.id === project.id;
                  return (
                    <div
                      key={project.id}
                      css={projectRowStyle(isSelected)}
                      onClick={() => setSelectedProject(project)}
                    >
                      <div css={rowInfoStyle}>
                        <span css={rowIdStyle}>#{project.id}</span>
                        <p css={rowTitleStyle}>{project.title}</p>
                      </div>
                      <span css={statusBadgeStyle(project.uploadCheck === 1)}>
                        {project.uploadCheck === 1 ? "노출중" : "숨김"}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div css={noDataStyle}>검색 결과가 없습니다.</div>
              )}
            </div>
          )}

          {totalPages > 1 && (
            <div css={miniPaginationStyle}>
              <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>&lsaquo;</button>
              <span>{currentPage} / {totalPages}</span>
              <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>&rsaquo;</button>
            </div>
          )}
        </div>

        {/* ================= 우측: 상세 및 토글 제어 구역 ================= */}
        <div css={rightDetailSectionStyle}>
          <AnimatePresence mode="wait">
            {selectedProject ? (
              <motion.div
                key={selectedProject.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                css={detailCardStyle}
              >
                <div css={detailHeaderStyle}>
                  <span css={detailIdStyle}>Project ID: {selectedProject.id}</span>
                  <div css={toggleControlBoxStyle}>
                    <span css={toggleLabelStyle(selectedProject.uploadCheck === 1)}>
                      {selectedProject.uploadCheck === 1 ? "사용자 화면 노출 ON" : "사용자 화면 노출 OFF"}
                    </span>
                    <label css={switchStyle}>
                      <input
                        type="checkbox"
                        checked={selectedProject.uploadCheck === 1}
                        onChange={() => handleToggleUpload(selectedProject.id, selectedProject.uploadCheck)}
                      />
                      <span className="slider" />
                    </label>
                  </div>
                </div>

                <hr css={dividerStyle} />

                <div css={detailBodyStyle}>
                  <label>프로젝트 제목</label>
                  <h3>{selectedProject.title}</h3>

                  <label>서브 타이틀</label>
                  <p css={detailSubTitleStyle}>{selectedProject.subTitle || "등록된 서브타이틀이 없습니다."}</p>

                  {/* 🖼️ 수정 완료된 가로 정렬 그리드형 이미지 리스트 구역 */}
                  <label>등록된 공간 사진 목록 ({imageList.length}개)</label>
                  {imageList.length > 0 ? (
                    <div css={imageGridListStyle}>
                      {imageList.map((imgName, index) => (
                        <div key={index} css={imageCardLayoutStyle}>
                          <div css={thumbnailBoxStyle}>
                            {/* ✅ 수정페이지 규칙과 일치하도록 /uploads/${imgName} 로 주소 변경 */}
                            <img 
                              src={`/uploads/${imgName}`} 
                              alt={`preview-${index}`}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://placehold.co/120x90?text=Load+Failed";
                              }}
                            />
                            {index === 0 && <span css={mainThumbnailBadgeStyle}>대표 이미지</span>}
                          </div>
                          <div css={imageNameBoxStyle}>
                            <span css={imageIndexStyle}>사진 {index + 1}</span>
                            <p css={imageTextNameStyle} title={imgName}>{imgName}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p css={detailFileEmptyStyle}>등록된 이미지가 없습니다.</p>
                  )}
                </div>
              </motion.div>
            ) : (
              <div css={emptyDetailStyle}>왼쪽 리스트에서 프로젝트를 선택해 주세요.</div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// --- Styles ---

const adminPageContainerStyle = css`
  padding: 120px 60px 60px 60px;
  max-width: 1400px;
  margin: 0 auto;
  font-family: sans-serif;
  @media (max-width: 768px) { padding: 100px 20px 40px 20px; }
`;

const adminHeaderStyle = css`
  margin-bottom: 40px;
  h2 { font-size: 2rem; font-weight: 800; color: #111; display: flex; align-items: center; gap: 10px; }
  p { font-size: 0.95rem; color: #666; margin-top: 6px; }
`;

const adminBadgeStyle = css`
  font-size: 0.75rem; background-color: ${colors?.primary || "#9e0012"}; color: #fff; padding: 3px 8px; border-radius: 4px; vertical-align: middle;
`;

const splitLayoutStyle = css`
  display: grid; grid-template-columns: 420px 1fr; gap: 40px; align-items: start;
  @media (max-width: 1024px) { grid-template-columns: 1fr; }
`;

const leftListSectionStyle = css` background-color: #f9f9f9; border: 1px solid #e5e5e5; border-radius: 12px; padding: 20px; `;
const searchBoxStyle = css`
  margin-bottom: 15px;
  input {
    width: 100%; padding: 12px 16px; font-size: 0.9rem; border: 1px solid #d1d1d1; border-radius: 8px; outline: none; box-sizing: border-box;
    &:focus { border-color: ${colors?.primary || "#9e0012"}; }
  }
`;

const listWrapperStyle = css` display: flex; flex-direction: column; gap: 10px; min-height: 400px; `;
const projectRowStyle = (isSelected: boolean) => css`
  display: flex; justify-content: space-between; align-items: center; padding: 14px 18px;
  background-color: ${isSelected ? "#fff" : "transparent"};
  border: 1px solid ${isSelected ? (colors?.primary || "#9e0012") : "transparent"};
  border-radius: 8px; cursor: pointer; transition: all 0.2s ease;
  box-shadow: ${isSelected ? "0 4px 12px rgba(158, 0, 18, 0.08)" : "none"};
  &:hover { background-color: #ffffff; border-color: ${isSelected ? (colors?.primary || "#9e0012") : "#d1d1d1"}; }
`;

const rowInfoStyle = css` display: flex; align-items: center; gap: 12px; overflow: hidden; white-space: nowrap; `;
const rowIdStyle = css` font-size: 0.85rem; font-weight: 600; color: #888; min-width: 35px; `;
const rowTitleStyle = css` font-size: 0.95rem; font-weight: 600; color: #222; overflow: hidden; text-overflow: ellipsis; `;
const statusBadgeStyle = (isActive: boolean) => css`
  font-size: 0.8rem; font-weight: 700; padding: 4px 10px; border-radius: 20px;
  background-color: ${isActive ? "#e6f7ed" : "#f0f0f0"}; color: ${isActive ? "#1f874c" : "#777777"};
`;

const miniPaginationStyle = css`
  display: flex; justify-content: center; align-items: center; gap: 15px; margin-top: 20px; font-size: 0.85rem; color: #555;
  button {
    border: 1px solid #d1d1d1; background: #fff; padding: 3px 10px; border-radius: 4px; cursor: pointer;
    &:disabled { opacity: 0.4; cursor: not-allowed; }
    &:hover:not(:disabled) { background-color: #eee; }
  }
`;

const rightDetailSectionStyle = css` position: sticky; top: 120px; `;
const detailCardStyle = css` background-color: #fff; border: 1px solid #e5e5e5; border-radius: 12px; padding: 35px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03); `;
const detailHeaderStyle = css` display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px; `;
const detailIdStyle = css` font-size: 0.9rem; font-weight: bold; color: #888; `;
const toggleControlBoxStyle = css` display: flex; align-items: center; gap: 12px; `;
const toggleLabelStyle = (isActive: boolean) => css` font-size: 0.9rem; font-weight: 700; color: ${isActive ? "#1f874c" : "#b13241"}; `;
const dividerStyle = css` border: 0; height: 1px; background-color: #eee; margin: 25px 0; `;

const detailBodyStyle = css`
  label { display: block; font-size: 0.85rem; font-weight: 700; color: ${colors?.primary || "#9e0012"}; text-transform: uppercase; margin-bottom: 10px; letter-spacing: 0.05em; }
  h3 { font-size: 1.6rem; font-weight: 700; color: #111; margin-bottom: 25px; }
`;
const detailSubTitleStyle = css` font-size: 1rem; color: #444; line-height: 1.5; margin-bottom: 25px; `;

// 🗂️ 가로 정렬 3열 그리드 형태의 이미지 목록 스타일 정의
const imageGridListStyle = css`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  max-height: 450px;
  overflow-y: auto;
  padding-right: 6px;
  margin-top: 10px;

  @media (max-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const imageCardLayoutStyle = css`
  display: flex;
  flex-direction: column;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  background-color: #fdfdfd;
  overflow: hidden;
  transition: transform 0.2s ease;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  }
`;

const thumbnailBoxStyle = css`
  width: 100%;
  height: 120px;
  background-color: #eaeaea;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const mainThumbnailBadgeStyle = css`
  position: absolute;
  top: 8px;
  left: 8px;
  background-color: rgba(197, 164, 126, 0.95);
  color: #fff;
  font-size: 0.65rem;
  font-weight: bold;
  padding: 3px 6px;
  border-radius: 4px;
  letter-spacing: -0.02em;
`;

const imageNameBoxStyle = css`
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  background-color: #fff;
  border-top: 1px solid #f0f0f0;
`;

const imageIndexStyle = css`
  font-size: 0.75rem;
  font-weight: 700;
  color: #888;
`;

const imageTextNameStyle = css`
  font-size: 0.8rem;
  color: #444;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
`;

const detailFileEmptyStyle = css` font-size: 0.9rem; color: #999; font-style: italic; `;
const emptyDetailStyle = css` border: 2px dashed #e5e5e5; border-radius: 12px; padding: 80px 0; text-align: center; color: #999; font-size: 1rem; `;
const noDataStyle = css` text-align: center; padding: 40px 0; color: #aaa; `;

const switchStyle = css`
  position: relative; display: inline-block; width: 50px; height: 26px;
  input { opacity: 0; width: 0; height: 0; }
  .slider {
    position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: 0.3s; border-radius: 34px;
    &::before { position: absolute; content: ""; height: 20px; width: 20px; left: 3px; bottom: 3px; background-color: white; transition: 0.3s; border-radius: 50%; }
  }
  input:checked + .slider { background-color: #1f874c; }
  input:focus + .slider { box-shadow: 0 0 1px #1f874c; }
  input:checked + .slider::before { transform: translateX(24px); }
`;