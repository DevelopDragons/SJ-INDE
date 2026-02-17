import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

// --- Animations ---
export const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// --- Styled Components ---
export const FullPageContainer = styled.div`
  height: 100vh;
  overflow-y: auto;
  scroll-snap-type: y mandatory; /* 브라우저 기본 스냅 기능 활용 */
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const Section = styled.section`
  position: relative;
  height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  scroll-snap-align: start;
  overflow: hidden;
`;

export const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1;
`;

export const InnerContent = styled.div`
  position: relative;
  z-index: 2;
  color: white;
  text-align: center;
  padding: 0 20px;
  animation: ${fadeIn} 1s ease-out;
`;

export const Kicker = styled.div`
  font-size: 0.9rem;
  letter-spacing: 0.3em;
  margin-bottom: 1rem;
  font-weight: 300;
`;

export const Divider = styled.div`
  width: 40px;
  height: 1px;
  background: white;
  margin: 1.5rem auto;
`;

export const SideNav = styled.aside`
  position: fixed;
  right: 40px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  text-align: right;

  @media (max-width: 768px) {
    right: 20px;
    display: none; /* 모바일에서는 숨김 처리 권장 */
  }
`;

export const SideLink = styled.a<{ isActive: boolean }>`
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-decoration: none;
  color: ${({ isActive }) => (isActive ? "#fff" : "rgba(255,255,255,0.4)")};
  transition: all 0.3s ease;
  font-weight: ${({ isActive }) => (isActive ? "bold" : "normal")};

  &::after {
    content: "";
    display: inline-block;
    width: ${({ isActive }) => (isActive ? "30px" : "0px")};
    height: 1px;
    background: white;
    margin-left: 10px;
    vertical-align: middle;
    transition: width 0.3s ease;
  }
`;
