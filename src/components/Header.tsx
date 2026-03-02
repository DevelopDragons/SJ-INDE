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
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "unset";
  }, [isMenuOpen]);

  if (!mounted) return null;

  // 메인("/")이 아니거나 스크롤이 되었을 때 검은색 헤더 활성화
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
    justifyContent: "space-between",
    transition: "all 0.4s cubic-bezier(0.19, 1, 0.22, 1)",
    
    // 핵심 수정: 메인이 아닐 때는 투명이 아닌 colors.black(또는 반투명 검정) 적용
    backgroundColor: isBlackHeader ? "rgba(0, 0, 0, 0.95)" : "transparent",
    backdropFilter: isBlackHeader ? "blur(15px)" : "none",
    borderBottom: isBlackHeader ? `1px solid ${colors.gray[900]}` : "none",
    
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
        <Link href="/" css={logoWrapperStyle}>
          <Image
            src="/logo/logo_white_text.png"
            alt="SJ INDE"
            // 스크롤 시 로고 크기 살짝 조정 로직 추가 가능
            width={isScrolled ? 100 : 120} 
            height={isScrolled ? 100 : 120}
            priority
            style={{ objectFit: "contain", transition: "all 0.3s ease" }}
          />
        </Link>

        <DesktopNav menuItems={menuItems} pathname={pathname} />

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