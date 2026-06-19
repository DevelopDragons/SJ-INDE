/** @jsxImportSource @emotion/react */
"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { css } from "@emotion/react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { colors } from "@/src/styles/colors";

interface Project {
  id: number;
  title: string;
  subTitle: string;
  saveNames: string | null;
}

export default function ProjectWritePage() {
  const router = useRouter();

  // --- 상태 관리 ---
  const [title, setTitle] = useState<string>("");
  const [subTitle, setSubTitle] = useState<string>("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isDragActive, setIsDragActive] = useState<boolean>(false);

  // 보안 관련 상태 추가 및 변경
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false); // 페이지 진입 권한 여부
  const [authMode, setAuthMode] = useState<"ENTRY" | "SUBMIT">("ENTRY"); // ENTRY: 진입 검증, SUBMIT: 제출 검증
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [isVerifying, setSearchVerifying] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 💡 페이지 접속 시 즉시 비밀번호 모달 오픈
  useEffect(() => {
    setAuthMode("ENTRY");
    setIsModalOpen(true);
  }, []);

  const handleFileAdd = (files: FileList | null) => {
    if (!files) return;
    const validFiles: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith("image/")) {
        validFiles.push(file);
      } else {
        alert("이미지 파일만 업로드할 수 있습니다.");
      }
    }
    setSelectedFiles((prev) => [...prev, ...validFiles]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileAdd(e.target.files);
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileAdd(e.dataTransfer.files);
    }
  }, []);

  const handleRemoveFile = (indexToRemove: number) => {
    setSelectedFiles((prev) =>
      prev.filter((_, index) => index !== indexToRemove),
    );
  };

  // 등록 버튼 클릭 시 트리거
  const handleFormSubmitTrigger = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !subTitle.trim()) {
      alert("프로젝트 제목과 부제목을 입력해주세요.");
      return;
    }
    if (selectedFiles.length === 0) {
      alert("최소 한 장 이상의 공간 이미지를 첨부해야 합니다.");
      return;
    }
    setPassword("");
    setAuthMode("SUBMIT"); // 제출을 위한 검증 모드로 변경
    setIsModalOpen(true);
  };

  // 💡 통합 비밀번호 검증 및 업로드 핸들러
  const handleVerifyPassword = async () => {
    if (!password.trim()) {
      alert("비밀번호를 입력해주세요.");
      return;
    }
    setSearchVerifying(true);

    try {
      const verifyRes = await fetch("/api/projects/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: password.trim() }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok)
        throw new Error(verifyData.message || "비밀번호가 일치하지 않습니다.");

      // 1. 페이지 진입 검증에 성공한 경우
      if (authMode === "ENTRY") {
        setIsAuthorized(true);
        setIsModalOpen(false);
        setPassword("");
        setSearchVerifying(false);
        return;
      }

      // 2. 최종 게시물 등록 검증에 성공한 경우
      setIsSubmitting(true);
      setIsModalOpen(false);

      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("subTitle", subTitle.trim());
      selectedFiles.forEach((file) => {
        formData.append("files", file);
      });

      const uploadRes = await fetch("/api/projects", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        const errorData = await uploadRes.json();
        throw new Error(
          errorData.message || "서버 포트폴리오 저장 중 오류가 발생했습니다.",
        );
      }

      alert("새로운 포트폴리오 프로젝트가 성공적으로 등록되었습니다.");
      router.push("/projects");
      router.refresh();
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) alert(err.message);
      else alert("인증 혹은 프로젝트 저장에 실패했습니다. 관리자 로그를 확인하세요.");
    } finally {
      setSearchVerifying(false);
      if (authMode === "SUBMIT") {
        setIsSubmitting(false);
      }
    }
  };

  // 모달 닫기(취소) 시 처리
  const handleModalCancel = () => {
    setIsModalOpen(false);
    // 페이지 진입 전 인증 취소 시 이전 페이지로 튕겨냄
    if (authMode === "ENTRY") {
      router.back();
    }
  };

  return (
    <div css={writePageContainerStyle}>
      <section css={formSectionStyle}>
        {/* 💡 인증이 성공했을 때만 본문 입력 폼 랜더링 */}
        {isAuthorized && (
          <motion.div
            css={formWrapperStyle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <form onSubmit={handleFormSubmitTrigger} css={formStyle}>
              {/* 1. 제목 입력 필드 */}
              <div css={inputGroupStyle}>
                <label css={labelStyle}>프로젝트명 (Title)</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="예: 청년다방 롯데월드점"
                  css={textInputStyle}
                  disabled={isSubmitting}
                />
              </div>

              {/* 2. 부제목 입력 필드 */}
              <div css={inputGroupStyle}>
                <label css={labelStyle}>설명 요약 (Sub Title)</label>
                <textarea
                  value={subTitle}
                  onChange={(e) => setSubTitle(e.target.value)}
                  placeholder="예: 청년다방 롯데월드점 26.01.01"
                  css={textareaInputStyle}
                  disabled={isSubmitting}
                />
              </div>

              {/* 3. 공간 사진 첨부 */}
              <div css={inputGroupStyle}>
                <label css={labelStyle}>공간 사진 첨부 (Images)</label>
                <div
                  css={dropZoneStyle(isDragActive)}
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    multiple
                    accept="image/*"
                    css={hiddenFileInputStyle}
                  />
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    css={uploadIconStyle}
                  >
                    <path
                      d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"
                      fill="currentColor"
                    />
                  </svg>
                  <p className="main-text">
                    클릭하거나 사진 파일을 여기로 끌어다 놓으세요.
                  </p>

                  <div
                    css={noticeContainerStyle}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <p className="sub-text">
                      <span className="accent-dot">•</span>{" "}
                      <strong>첫 번째로 첨부된 이미지</strong>가 메인 화면의{" "}
                      <strong>썸네일</strong>로 지정됩니다.
                    </p>
                    <p className="sub-text">
                      <span className="accent-dot">•</span> 시스템 안정성을 위해
                      파일명은 반드시 <strong>영문 또는 숫자</strong>로
                      업로드해주세요.
                    </p>
                    <p className="sub-text-info">
                      JPG, PNG, WEBP 등 고해상도 이미지 다중 선택 가능
                    </p>
                  </div>
                </div>

                {/* 업로드 대상 파일 리스트 카드 */}
                {selectedFiles.length > 0 && (
                  <div css={fileListContainerStyle}>
                    <div className="list-header">
                      선택된 파일 ({selectedFiles.length}개)
                    </div>
                    <div css={fileGridStyle}>
                      {selectedFiles.map((file, index) => (
                        <div key={`${file.name}-${index}`} css={fileCardStyle}>
                          <div className="img-thumbnail">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={URL.createObjectURL(file)} alt="preview" />
                            {index === 0 && (
                              <span css={thumbnailBadgeStyle}>THUMBNAIL</span>
                            )}
                          </div>
                          <div className="file-info">
                            <span className="file-name">{file.name}</span>
                            <span className="file-size">
                              {(file.size / (1024 * 1024)).toFixed(2)} MB
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveFile(index);
                            }}
                            css={fileDeleteButtonStyle}
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 하단 제어부 버튼 바 */}
              <div css={actionButtonContainerStyle}>
                <button
                  type="button"
                  onClick={() => router.back()}
                  css={cancelButtonStyle}
                  disabled={isSubmitting}
                >
                  취소
                </button>
                <button
                  type="submit"
                  css={submitButtonStyle(isSubmitting)}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "처리 중..." : "아카이브 등록하기"}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </section>

      {/* 관리자 비밀번호 검증 모달 */}
      <AnimatePresence>
        {isModalOpen && (
          <div css={modalOverlayStyle}>
            <motion.div
              css={modalBoxStyle}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <h3 className="modal-title">보안 인증</h3>
              <p className="modal-desc">
                {authMode === "ENTRY" 
                  ? "작성 페이지에 진입하려면 관리자 비밀번호를 입력해주세요."
                  : "포트폴리오 업로드를 완료하려면 관리자 비밀번호를 한번 더 입력해주세요."}
              </p>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isVerifying)
                    handleVerifyPassword();
                }}
                placeholder="관리자 패스워드 입력"
                css={modalInputStyle}
                autoFocus
              />
              <div css={modalActionStyle}>
                <button
                  type="button"
                  onClick={handleModalCancel}
                  css={modalCancelBtnStyle}
                  disabled={isVerifying}
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={handleVerifyPassword}
                  css={modalSubmitBtnStyle(isVerifying)}
                  disabled={isVerifying}
                >
                  {isVerifying ? "인증 중..." : "인증 확인"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Styles (기존과 동일함) ---
const writePageContainerStyle = css`
  width: 100%;
  min-height: 100vh;
  background-color: ${colors.white};
`;
const formSectionStyle = css`
  width: 100%;
  background-color: ${colors.white};
  padding-top: 120px;
  padding-bottom: 120px;
  position: relative;
  z-index: 10;
`;
const formWrapperStyle = css`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 40px;
  @media (max-width: 768px) {
    padding: 0 20px;
  }
`;
const formStyle = css`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
`;
const inputGroupStyle = css`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`;
const labelStyle = css`
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: ${colors?.primary || "#111111"};
`;
const textInputStyle = css`
  width: 100%;
  padding: 14px 20px;
  font-size: 0.95rem;
  color: ${colors?.gray?.[800] || "#222222"};
  background-color: ${colors.white};
  border: 1.5px solid ${colors?.accent || "#c5a47e"};
  border-radius: 8px;
  outline: none;
  &:focus {
    box-shadow: 0 4px 15px rgba(197, 164, 126, 0.15);
  }
  &:disabled {
    background-color: #f9f9f9;
    cursor: not-allowed;
  }
`;
const textareaInputStyle = css`
  width: 100%;
  min-height: 140px;
  padding: 14px 20px;
  font-size: 0.95rem;
  color: ${colors?.gray?.[800] || "#222222"};
  background-color: ${colors.white};
  border: 1.5px solid ${colors?.accent || "#c5a47e"};
  border-radius: 8px;
  outline: none;
  resize: vertical;
  line-height: 1.6;
  &:focus {
    box-shadow: 0 4px 15px rgba(197, 164, 126, 0.15);
  }
  &:disabled {
    background-color: #f9f9f9;
    cursor: not-allowed;
  }
`;
const hiddenFileInputStyle = css`
  display: none;
`;
const dropZoneStyle = (isActive: boolean) => css`
  width: 100%;
  padding: 40px 20px;
  border: 2px dashed ${colors?.accent || "#c5a47e"};
  background-color: ${isActive ? "rgba(197, 164, 126, 0.05)" : "transparent"};
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .main-text {
    font-size: 0.95rem;
    font-weight: 500;
    margin: 10px 0 4px 0;
    color: ${colors?.primary || "#111111"};
  }
`;
const uploadIconStyle = css`
  color: ${colors?.accent || "#c5a47e"};
`;
const noticeContainerStyle = css`
  margin-top: 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: center;
  .sub-text {
    font-size: 0.85rem;
    color: ${colors?.gray?.[600] || "#666666"};
    line-height: 1.4;
    margin: 0;
    strong {
      color: ${colors?.primary || "#111111"};
      font-weight: 600;
    }
  }
  .accent-dot {
    color: ${colors?.accent || "#c5a47e"};
    margin-right: 4px;
    font-weight: bold;
  }
  .sub-text-info {
    font-size: 0.78rem;
    color: ${colors?.gray?.[400] || "#aaaaaa"};
    margin-top: 4px;
  }
`;
const fileListContainerStyle = css`
  margin-top: 1.5rem;
  .list-header {
    font-size: 0.85rem;
    font-weight: 700;
    margin-bottom: 0.8rem;
  }
`;
const fileGridStyle = css`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;
const fileCardStyle = css`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  border: 1px solid ${colors?.gray?.[200] || "#e5e5e5"};
  border-radius: 6px;
  background-color: #fafafa;
  position: relative;
  .img-thumbnail {
    width: 50px;
    height: 50px;
    border-radius: 4px;
    overflow: hidden;
    position: relative;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .file-info {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    padding-right: 20px;
    .file-name {
      font-size: 0.85rem;
      font-weight: 500;
      color: #222222;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .file-size {
      font-size: 0.75rem;
      color: ${colors?.gray?.[400] || "#aaaaaa"};
    }
  }
`;
const thumbnailBadgeStyle = css`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: rgba(197, 164, 126, 0.9);
  color: ${colors.white};
  font-size: 0.55rem;
  font-weight: bold;
  text-align: center;
  padding: 2px 0;
`;
const fileDeleteButtonStyle = css`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 1.2rem;
  color: ${colors?.gray?.[400] || "#aaaaaa"};
  cursor: pointer;
  &:hover {
    color: #ff4d4f;
  }
`;
const actionButtonContainerStyle = css`
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 1.5rem;
`;
const cancelButtonStyle = css`
  padding: 14px 28px;
  font-size: 0.95rem;
  font-weight: 700;
  color: #222222;
  background-color: transparent;
  border: 1.5px solid ${colors?.primary || "#9e0012"};
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.25, 1, 0.5, 1);
  &:hover {
    background-color: rgba(229, 0, 0, 0.04);
    box-shadow: 0 4px 12px rgba(229, 0, 0, 0.06);
  }
`;
const submitButtonStyle = (isSubmitting: boolean) => css`
  padding: 14px 35px;
  font-size: 0.95rem;
  font-weight: 600;
  color: ${colors.white};
  background-color: ${colors?.primary || "#111111"};
  border: none;
  border-radius: 6px;
  cursor: ${isSubmitting ? "not-allowed" : "pointer"};
  opacity: ${isSubmitting ? 0.7 : 1};
`;
const modalOverlayStyle = css`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;
const modalBoxStyle = css`
  background-color: ${colors.white};
  padding: 30px;
  border-radius: 12px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  border: 1px solid ${colors?.gray?.[100] || "#f5f5f5"};
  .modal-title {
    font-size: 1.2rem;
    font-weight: 700;
    color: ${colors?.primary || "#111111"};
    margin-bottom: 8px;
  }
  .modal-desc {
    font-size: 0.88rem;
    color: ${colors?.gray?.[500] || "#666666"};
    line-height: 1.5;
    margin-bottom: 20px;
  }
`;
const modalInputStyle = css`
  width: 100%;
  padding: 12px 16px;
  font-size: 1rem;
  color: ${colors?.gray?.[800] || "#222222"};
  border: 1.5px solid ${colors?.accent || "#c5a47e"};
  border-radius: 6px;
  outline: none;
  letter-spacing: 0.3em;
  text-align: center;
  margin-bottom: 24px;
`;
const modalActionStyle = css`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;
const modalCancelBtnStyle = css`
  padding: 10px 20px;
  font-size: 0.9rem;
  background: none;
  border: 1px solid ${colors?.gray?.[300] || "#d9d9d9"};
  border-radius: 6px;
  cursor: pointer;
  color: ${colors?.gray?.[600] || "#666666"};
`;
const modalSubmitBtnStyle = (isVerifying: boolean) => css`
  padding: 10px 24px;
  font-size: 0.9rem;
  font-weight: 600;
  color: ${colors.white};
  background-color: ${colors?.primary || "#111111"};
  border: none;
  border-radius: 6px;
  cursor: ${isVerifying ? "not-allowed" : "pointer"};
  opacity: ${isVerifying ? 0.7 : 1};
`;