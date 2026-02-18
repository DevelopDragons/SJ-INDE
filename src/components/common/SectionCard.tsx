"use client";

import styled from "@emotion/styled";
import Link from "next/link";

// --- Component Definition ---
interface SectionCardProps {
  title: string;
  description: string;
  href: string;
  linkLabel?: string;
}

export default function SectionCard({
  title,
  description,
  href,
  linkLabel = "MORE",
}: SectionCardProps) {
  return (
    <Link href={href} style={{ textDecoration: "none", color: "inherit" }}>
      <StyledCard>
        <CardTitle>{title}</CardTitle>
        <CardText>{description}</CardText>
        <MoreButton>
          <span>{linkLabel}</span>
          <span className="more-arrow">→</span>
        </MoreButton>
      </StyledCard>
    </Link>
  );
}

// --- Styled Components ---
// 공통 그리드 레이아웃
export const ResponsiveGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 4rem;
  width: 100%;
`;

// 카드 스타일
const StyledCard = styled.div`
  background: #ffffff;
  padding: 40px;
  border: 1px solid #f3f4f6;
  transition: all 0.3s ease;
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);

    h3 {
      color: #2563eb;
    }
    .more-arrow {
      transform: translateX(5px);
    }
  }
`;

const CardTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  transition: color 0.3s ease;
`;

const CardText = styled.p`
  color: #6b7280;
  margin-bottom: 1.5rem;
  line-height: 1.6;
  flex-grow: 1; /* 설명이 짧아도 화살표 버튼 위치를 맞춤 */
`;

const MoreButton = styled.div`
  display: flex;
  align-items: center;
  color: #2563eb;
  font-weight: 600;
  font-size: 0.9rem;

  .more-arrow {
    margin-left: 8px;
    transition: transform 0.3s ease;
  }
`;
