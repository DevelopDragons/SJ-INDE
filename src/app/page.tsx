"use client";

import { useEffect } from "react";
import * as S from "./main.styles";
import SectionCard, { ResponsiveGrid } from "../components/common/SectionCard";
import CommonButton from "../components/common/Button";

export default function HomePage() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fadeInUp");
          }
        });
      },
      { threshold: 0.1 },
    );

    const elements = document.querySelectorAll(".fade-in-section");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <S.FullPage>
      {/* Hero Section */}
      <S.HeroSection>
        <div style={{ zIndex: 10 }}>
          <S.HeroTitle>
            WE DESIGN
            <br />
            THE FUTURE OF SPACE
            <br />
            WITH VALUE IN MIND.
          </S.HeroTitle>
          <S.ScrollIndicator>
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>SCROLL</span>
          </S.ScrollIndicator>
        </div>
      </S.HeroSection>

      {/* Company Section */}
      <S.ContentSection className="fade-in-section" bgColor="#ffffff">
        <S.Container>
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <S.SectionTitle>COMPANY</S.SectionTitle>
            <S.Description>
              P&K INC는
              <br />
              최고의 <strong>전문성, 기술력</strong>을 바탕으로
              <br />
              가치있는 공간을 창조하는
              <br />
              <strong>신뢰받는 기업</strong>입니다.
            </S.Description>
            <CommonButton href="/company/overview">OVERVIEW</CommonButton>
          </div>
        </S.Container>
      </S.ContentSection>

      {/* Business Section */}
      <S.ContentSection className="fade-in-section" bgColor="#f9fafb">
        <S.Container>
          <ResponsiveGrid>
            <SectionCard
              title="BUSINESS"
              description="축적된 시공경험 및 기술력으로 전문 맞춤 시스템을 구축하며..."
              href="/business/work"
            />
            <SectionCard
              title="DESIGN PROCESS"
              description="더 나은 공간제안을 위한 P&K INC의 디자인 프로세스를 안내드립니다."
              href="/business/work#process"
            />
            <SectionCard
              title="CLIENTS"
              description="국내외(글로벌) 고객사와 협력을 통해 끊임없는 성장을 하고 있습니다."
              href="/business/clients"
            />
          </ResponsiveGrid>
        </S.Container>
      </S.ContentSection>
    </S.FullPage>
  );
}
