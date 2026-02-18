/** @jsxImportSource @emotion/react */
"use client";

import { useState, useEffect } from "react";
import { css } from "@emotion/react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { colors } from "../styles/colors";
import { menuItems } from "@/public/data/menu";

import DesktopNav from "../components/nav/DesktopNav";
import MobileNav from "../components/nav/MobileNav";
import MenuToggleButton from "../components/nav/MenuToggleButton";

export default function Header() {
  const [mounted, setMounted] = useState(false); // Hydration 에러 방지용
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // 1. 컴포넌트 마운트 확인 (Hydration 에러 해결 핵심)
  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "unset";
  }, [isMenuOpen]);

  // 마운트되기 전에는 에러 방지를 위해 기본 형태만 반환하거나 null 반환
  if (!mounted) return null;

  const isBlackHeader = isScrolled || pathname !== "/";

  const headerStyle = css({
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    height: isScrolled ? "70px" : "90px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between", // 모바일/데스크탑 모두 양끝 배치를 위해 추가
    transition: "all 0.5s cubic-bezier(0.19, 1, 0.22, 1)",
    backgroundColor: "transparent",
    backdropFilter: isBlackHeader ? "blur(15px)" : "none",
    padding: "0 60px",
    "@media (max-width: 1024px)": { padding: "0 30px" },
    "@media (max-width: 768px)": {
      height: "60px",
      padding: "0 20px",
    },
  });

  return (
    <>
      <header css={headerStyle}>
        {/* 로고: 텍스트 대신 이미지 적용 */}
        <Link href="/" css={logoWrapperStyle}>
          <Image
            src="/logo/logo_white_text.png" // Footer와 동일한 경로
            alt="SJ INDE"
            width={120} // 스크롤 시 로고 크기도 살짝 축소
            height={120}
            priority // 헤더 로고이므로 우선순위 로딩
            style={{ objectFit: "contain", transition: "all 0.3s ease" }}
          />
        </Link>

        {/* 데스크탑 메뉴: DesktopNav 내부에서 marginLeft: auto로 밀어주고 있음 */}
        <DesktopNav menuItems={menuItems} pathname={pathname} />

        {/* 모바일 토글 버튼: 모바일에서는 justify-content: space-between에 의해 자동으로 우측 배치 */}
        <MenuToggleButton
          isOpen={isMenuOpen}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        />
      </header>

      <MobileNav
        isOpen={isMenuOpen}
        menuItems={menuItems}
        onClose={() => setIsMenuOpen(false)}
      />
    </>
  );
}

const logoWrapperStyle = css({
  display: "flex",
  alignItems: "center",
  textDecoration: "none",
});
