/** @jsxImportSource @emotion/react */
"use client";

import { css } from "@emotion/react";
import { motion, Variants } from "framer-motion";
import { colors } from "@/src/styles/colors";
import { data_about } from "@/public/data/about";
import PageSlogan from "@/src/components/text/PageSlogan";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CompanyAboutPage() {
  const pathname = usePathname();

  const revealVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.215, 0.61, 0.355, 1] },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  return (
    <div css={aboutPageContainerStyle}>
      {/* 🧭 우측 서브페이지 네비게이션 추가 */}
      <aside css={asideStyle}>
        <Link
          href="/company/about"
          css={navLinkStyle(pathname === "/company/about")}
        >
          ABOUT US
        </Link>
        <Link
          href="/company/history"
          css={navLinkStyle(pathname === "/company/history")}
        >
          HISTORY
        </Link>
        <Link
          href="/company/organization"
          css={navLinkStyle(pathname === "/company/organization")}
        >
          ORGANIZATION
        </Link>
      </aside>

      <PageSlogan
        topLabel="DESIGN PHILOSOPHY"
        title={
          <>
            Beyond <span className="outline">Spatial</span>{" "}
            <span className="accent">Essence.</span>
          </>
        }
        description={data_about.desc}
      />

      <section css={ceoSectionStyle}>
        <div css={containerCustomStyle}>
          <div css={ceoContentLayoutStyle}>
            <motion.div
              css={ceoImageAreaStyle}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <img
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200"
                alt="Studio Atmosphere"
              />
            </motion.div>

            <motion.div
              css={ceoMessageWrapperStyle}
              initial="hidden"
              whileInView="show"
              variants={containerVariants}
              viewport={{ once: true }}
            >
              <motion.h3 css={ceoGreetingStyle} variants={revealVariants}>
                인간과 환경, <br />
                문화를 하나로 통일합니다.
              </motion.h3>

              <motion.div css={ceoTextBodyStyle} variants={revealVariants}>
                {data_about.message.split("\n\n").map((paragraph, i) => (
                  <p key={i} css={paragraphStyle}>
                    {paragraph}
                  </p>
                ))}
              </motion.div>

              <motion.div css={ceoSignAreaStyle} variants={revealVariants}>
                <div css={dividerStyle} />
                <p css={ceoNameStyle}>
                  <strong>SUNJUN ID</strong> 대표{" "}
                  <span>{data_about.ceo.split("").join(" ")}</span>
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

// --- Styles ---
const aboutPageContainerStyle = css`
  padding-top: 60px;
  position: relative;
`;

const containerCustomStyle = css`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const ceoSectionStyle = css`
  padding: 10rem 0;
  background-color: ${colors.gray[100]};
`;

const ceoImageAreaStyle = css`
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1.2;
  overflow: hidden;
  border-radius: 2px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: grayscale(100%);
    transition: transform 1.2s ease-out;

    &:hover {
      transform: scale(1.05);
    }
  }

  @media (max-width: 1024px) {
    max-width: 600px;
    margin: 0 auto;
  }
`;

const ceoContentLayoutStyle = css`
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 4rem;
  align-items: flex-start;

  @media (max-width: 1200px) {
    gap: 3rem;
  }

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 4rem;
  }
`;

const ceoMessageWrapperStyle = css`
  display: flex;
  flex-direction: column;
`;

const ceoGreetingStyle = css`
  font-size: 2rem;
  font-weight: 800;
  line-height: 1.35;
  color: ${colors.primary};
  margin-bottom: 2.5rem;
  letter-spacing: -0.02em;
`;

const ceoTextBodyStyle = css`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const paragraphStyle = css`
  line-height: 1.5;
  color: ${colors.gray[600]};
  font-size: 1.05rem;
  white-space: pre-wrap;
  word-break: keep-all;
`;

const ceoSignAreaStyle = css`
  margin-top: 3rem;
`;

const dividerStyle = css`
  width: 40px;
  height: 1px;
  background-color: ${colors.primary};
  margin-bottom: 1.5rem;
`;

const ceoNameStyle = css`
  font-size: 1.1rem;
  color: ${colors.gray[500]};

  strong {
    color: ${colors.primary};
    font-weight: 800;
    margin-right: 0.5rem;
  }

  span {
    font-size: 1.4rem;
    font-weight: 700;
    color: ${colors.gray[800]};
    margin-left: 0.75rem;
    position: relative;
  }
`;

/* 🧭 네비게이션 공통 스타일 */
const asideStyle = css`
  position: fixed;
  right: 40px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  @media (max-width: 1024px) {
    display: none;
  }
`;

const navLinkStyle = (isActive: boolean) => css`
  font-size: 0.7rem;
  text-decoration: none;
  color: ${isActive ? colors.primary : colors.gray[400]};
  font-weight: ${isActive ? "bold" : "normal"};
  transition: all 0.4s ease;
  text-align: right;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  letter-spacing: 0.05em;
  &::after {
    content: "";
    width: ${isActive ? "30px" : "10px"};
    height: 1px;
    background: ${isActive ? colors.primary : colors.gray[300]};
    transition: all 0.4s ease;
  }
`;
