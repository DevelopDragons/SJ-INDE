import styled from "@emotion/styled";
import { keyframes, css } from "@emotion/react";

// --- Animations ---
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
`;

// --- Components ---
export const FullPage = styled.div`
  width: 100%;
  min-height: 100vh;
`;

export const HeroSection = styled.section`
  position: relative;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #111827 0%, #1f2937 100%);
  color: #ffffff;
  overflow: hidden;
  text-align: center;
`;

export const HeroTitle = styled.h1`
  font-size: clamp(2.5rem, 8vw, 5rem);
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 2rem;
  z-index: 10;
`;

export const ScrollIndicator = styled.div`
  margin-top: 3rem;
  animation: ${bounce} 2s infinite;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  letter-spacing: 0.1rem;
`;

export const ContentSection = styled.section<{ bgColor?: string }>`
  padding: 100px 20px;
  background-color: ${({ bgColor }) => bgColor || "#ffffff"};
  display: flex;
  justify-content: center;

  /* Observer에 의해 추가될 클래스 */
  &.animate-fadeInUp {
    animation: ${fadeInUp} 0.8s ease-out forwards;
  }
`;

export const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

export const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  text-align: center;
`;

export const Description = styled.p`
  font-size: 1.25rem;
  line-height: 1.8;
  color: #374151;
  text-align: center;
  margin-bottom: 2rem;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 4rem;
`;

export const Card = styled.div`
  background: #ffffff;
  padding: 40px;
  border: 1px solid #f3f4f6;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);

    h3 {
      color: #2563eb;
    } /* Accent Color */
    .more-arrow {
      transform: translateX(5px);
    }
  }
`;

export const CardTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  transition: color 0.3s ease;
`;

export const CardText = styled.p`
  color: #6b7280;
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

export const MoreButton = styled.div`
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
