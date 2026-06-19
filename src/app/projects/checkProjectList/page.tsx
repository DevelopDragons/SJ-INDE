/** @jsxImportSource @emotion/react */
"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { css } from "@emotion/react";
import { motion, AnimatePresence } from "framer-motion";
import { colors } from "@/src/styles/colors";

interface Project {
  id: number;
  title: string;
  subTitle: string;
  saveNames: string | null;
  uploadCheck: number;
}

// 💡 보안 및 토글 처리를 위한 통합 모달 상태 인터페이스
interface AuthModalState {
  isOpen: boolean;
  mode: "ENTRY" | "TOGGLE"; // 페이지 진입 인증 vs 토글 변경 인증
  targetProjectId: number | null;
  targetCurrentStatus: number | null;
  targetProjectTitle: string;
}

export default function AdminProjectCheckPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  // 💡 보안 및 인증 관련 상태
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  
  const passwordInputRef = useRef<HTMLInputElement>(null);

  // 💡 통합 인증 모달 상태 관리
  const [authModal, setAuthModal] = useState<AuthModalState>({
    isOpen: false,
    mode: "ENTRY",
    targetProjectId: null,
    targetCurrentStatus: null,
    targetProjectTitle: "",
  });

  // 1. 페이지 최초 진입 시 비밀번호 인증 모달 강제 오픈
  useEffect(() => {
    setAuthModal({
      isOpen: true,
      mode: "ENTRY",
      targetProjectId: null,
      targetCurrentStatus: null,
      targetProjectTitle: "",
    });
  }, []);

  // 💡 모달이 열리면 패스워드 인풋에 포커스를 안전하게 주입 (하이드레이션 충돌 방지)
  useEffect(() => {
    if (authModal.isOpen) {
      const timer = setTimeout(() => {
        passwordInputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [authModal.isOpen]);

  // 2. 인증이 완료된 후에만 백엔드로부터 프로젝트 리스트 패치 수행
  useEffect(() => {
    if (!isAuthorized) return;

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
  }, [isAuthorized]);

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

  // 💡 토글 스위치 변경 핸들러 -> 비밀번호 입력 상태로 모달 오픈
  const openToggleAuthModal = (project: Project) => {
    setPassword("");
    setAuthModal({
      isOpen: true,
      mode: "TOGGLE",
      targetProjectId: project.id,
      targetCurrentStatus: project.uploadCheck,
      targetProjectTitle: project.title,
    });
  };

  // 💡 비밀번호 검증 API 호출 및 처리 후속 로직
  const handleVerifyPassword = async () => {
    if (!password.trim()) {
      alert("비밀번호를 입력해주세요.");
      return;
    }
    setIsVerifying(true);

    try {
      // API 라우트를 수정 페이지와 통합 사용하거나 기존 비밀번호 검증 라우트(/api/projects/verify) 호출
      const verifyRes = await fetch("/api/projects/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: password.trim() }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) throw new Error(verifyData.message || "비밀번호가 일치하지 않습니다.");

      // Case A: 페이지 첫 진입 인증 성공 시
      if (authModal.mode === "ENTRY") {
        setIsAuthorized(true);
        setAuthModal(prev => ({ ...prev, isOpen: false }));
        setPassword("");
        return;
      }

      // Case B: 토글 스위치 조작 인증 성공 시 실제 데이터 변경 요청 진행
      const { targetProjectId, targetCurrentStatus } = authModal;
      if (targetProjectId === null || targetCurrentStatus === null) return;

      const nextStatus = targetCurrentStatus === 1 ? 0 : 1;
      const res = await fetch(`/api/projects/${targetProjectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uploadCheck: nextStatus }),
      });
      if (!res.ok) throw new Error("토글 상태 업데이트 실패");

      // 성공 후 상태 동기화
      setProjects((prev) =>
        prev.map((p) => (p.id === targetProjectId ? { ...p, uploadCheck: nextStatus } : p))
      );
      if (selectedProject && selectedProject.id === targetProjectId) {
        setSelectedProject((prev) => prev ? { ...prev, uploadCheck: nextStatus } : null);
      }

      alert(`[${authModal.targetProjectTitle}] 노출 상태가 정상적으로 변경되었습니다.`);
      setAuthModal({ isOpen: false, mode: "ENTRY", targetProjectId: null, targetCurrentStatus: null, targetProjectTitle: "" });
      setPassword("");
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) alert(err.message);
      else alert("인증 처리 도중 오류가 발생했습니다.");
    } finally {
      setIsVerifying(false);
    }
  };

  // 모달 취소 버튼 누를 때 핸들러
  const handleModalCancel = () => {
    setAuthModal(prev => ({ ...prev, isOpen: false }));
    setPassword("");
    if (authModal.mode === "ENTRY") {
      // 첫 페이지 진입 인증을 취소하면 전 페이지로 튕김 처리
      window.history.back();
    }
  };

  const imageList = useMemo(() => {
    if (!selectedProject?.saveNames) return [];
    return selectedProject.saveNames
      .split(",")
      .map((name) => name.trim())
      .filter((name) => name.length > 0);
  }, [selectedProject]);

  // 💡 [중요] 최초 권한 승인 전 레이아웃 블로킹 및 모달 출력
  if (!isAuthorized) {
    return (
      <div css={loadingContainerStyle}>
        <p>보안 인증을 진행 중입니다...</p>
        <AnimatePresence>
          {authModal.isOpen && (
            <div css={modalOverlayStyle}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", duration: 0.4 }}
                css={modalContentStyle}
              >
                <h3>관리자 인증</h3>
                <p className="description">
                  프로젝트 노출 관리 페이지에 진입하려면 관리자 비밀번호를 입력해주세요.
                </p>
                <input
                  ref={passwordInputRef}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !isVerifying) handleVerifyPassword();
                  }}
                  placeholder="패스워드 입력"
                  css={modalInputStyle}
                />
                <div css={modalButtonGroupStyle}>
                  <button className="cancel-btn" onClick={handleModalCancel} disabled={isVerifying}>
                    취소
                  </button>
                  <button className="confirm-btn" onClick={handleVerifyPassword} disabled={isVerifying}>
                    {isVerifying ? "확인 중..." : "인증하기"}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }

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
                        onChange={() => openToggleAuthModal(selectedProject)}
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

                  <label>등록된 공간 사진 목록 ({imageList.length}개)</label>
                  {imageList.length > 0 ? (
                    <div css={imageGridListStyle}>
                      {imageList.map((imgName, index) => (
                        <div key={index} css={imageCardLayoutStyle}>
                          <div css={thumbnailBoxStyle}>
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

      {/* ================= 💡 토글 변경 시 사용되는 동일 패스워드 검증 모달 구역 ================= */}
      <AnimatePresence>
        {authModal.isOpen && authModal.mode === "TOGGLE" && (
          <div css={modalOverlayStyle}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.4 }}
              css={modalContentStyle}
            >
              <h3>노출 상태 변경 인증</h3>
              <p className="project-title">[{authModal.targetProjectTitle}]</p>
              <p className="description">
                상태를 <strong>{authModal.targetCurrentStatus === 1 ? "['숨김']" : "['노출중']"}</strong>으로 변경하기 위해 관리자 패스워드를 입력해주세요.
              </p>
              
              <input
                ref={passwordInputRef}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isVerifying) handleVerifyPassword();
                }}
                placeholder="패스워드 입력"
                css={modalInputStyle}
              />
              
              <div css={modalButtonGroupStyle}>
                <button className="cancel-btn" onClick={handleModalCancel} disabled={isVerifying}>
                  취소
                </button>
                <button className="confirm-btn" onClick={handleVerifyPassword} disabled={isVerifying}>
                  {isVerifying ? "인증 중..." : "변경 승인"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Styles ---

const loadingContainerStyle = css`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 1.1rem;
  color: #666666;
  background-color: #fff;
`;

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

const imageGridListStyle = css`
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; max-height: 450px; overflow-y: auto; padding-right: 6px; margin-top: 10px;
  @media (max-width: 640px) { grid-template-columns: repeat(2, 1fr); }
`;

const imageCardLayoutStyle = css`
  display: flex; flex-direction: column; border: 1px solid #e5e5e5; border-radius: 8px; background-color: #fdfdfd; overflow: hidden; transition: transform 0.2s ease;
  &:hover { transform: translateY(-2px); box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05); }
`;

const thumbnailBoxStyle = css`
  width: 100%; height: 120px; background-color: #eaeaea; position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center;
  img { width: 100%; height: 100%; object-fit: cover; }
`;

const mainThumbnailBadgeStyle = css`
  position: absolute; top: 8px; left: 8px; background-color: rgba(197, 164, 126, 0.95); color: #fff; font-size: 0.65rem; font-weight: bold; padding: 3px 6px; border-radius: 4px; letter-spacing: -0.02em;
`;

const imageNameBoxStyle = css` padding: 10px; display: flex; flex-direction: column; gap: 4px; background-color: #fff; border-top: 1px solid #f0f0f0; `;
const imageIndexStyle = css` font-size: 0.75rem; font-weight: 700; color: #888; `;
const imageTextNameStyle = css` font-size: 0.8rem; color: #444; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin: 0; `;
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

const modalOverlayStyle = css`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const modalContentStyle = css`
  background-color: #fff;
  padding: 30px;
  border-radius: 14px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  text-align: center;
  h3 { font-size: 1.25rem; font-weight: 700; color: #222; margin-bottom: 12px; }
  .project-title { font-size: 0.95rem; font-weight: 600; color: #666; margin-bottom: 12px; word-break: break-all; }
  .description { font-size: 0.95rem; color: #444; line-height: 1.5; margin-bottom: 20px; strong { color: ${colors?.primary || "#9e0012"}; font-weight: 700; } }
`;

const modalInputStyle = css`
  width: 100%;
  padding: 12px 16px;
  font-size: 1rem;
  color: #222222;
  border: 1.5px solid ${colors?.accent || "#c5a47e"};
  border-radius: 6px;
  outline: none;
  letter-spacing: 0.3em;
  text-align: center;
  margin-bottom: 24px;
  box-sizing: border-box;
  &:focus { box-shadow: 0 4px 15px rgba(197, 164, 126, 0.15); }
`;

const modalButtonGroupStyle = css`
  display: flex;
  gap: 12px;
  button { flex: 1; padding: 12px 0; font-size: 0.95rem; font-weight: 600; border-radius: 8px; border: none; cursor: pointer; transition: background-color 0.2s ease; }
  .cancel-btn { background-color: #f1f1f1; color: #555; &:hover { background-color: #e5e5e5; } }
  .confirm-btn { background-color: ${colors?.primary || "#9e0012"}; color: #fff; &:hover { opacity: 0.9; } }
`;