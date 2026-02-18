"use client";

import styled from "@emotion/styled";
import Link from "next/link";
import { ReactNode } from "react";

// --- Component Definition ---

interface CommonButtonProps {
  children: ReactNode;
  href: string;
  variant?: "primary" | "outline";
  className?: string;
}

export default function CommonButton({
  children,
  href,
  variant = "primary",
  className,
}: CommonButtonProps) {
  return (
    <ButtonWrapper className={className}>
      <Link href={href} style={{ textDecoration: "none" }}>
        <StyledButton variant={variant}>{children}</StyledButton>
      </Link>
    </ButtonWrapper>
  );
}

// --- Styled Components ---

const StyledButton = styled.button<{ variant?: "primary" | "outline" }>`
  padding: 12px 32px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  /* 기본 스타일 (Primary) */
  background-color: #111;
  color: #fff;

  &:hover {
    background-color: #333;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
  }

  /* 나중에 다른 색상 버전이 필요하면 추가할 수 있도록 설계 */
  ${({ variant }) =>
    variant === "outline" &&
    `
    background-color: transparent;
    color: #111;
    border: 1px solid #111;
    &:hover {
      background-color: #111;
      color: #fff;
    }
  `}
`;

const ButtonWrapper = styled.div`
  text-align: center;
  margin-top: 2rem;
`;
