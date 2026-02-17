/** @jsxImportSource @emotion/react */
"use client";

import { css } from "@emotion/react";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import CommonButton from "../components/common/Button";
import { contactDataList } from "../../public/data/company";
import { data_main } from "../../public/data/main";
import ContactInfo from "../components/main/ContactInfo";
import BlurredBgButton from "../components/common/BlurredBgButton";

export default function HomePage() {
  const [activeSection, setActiveSection] = useState("main");
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.5 },
    );

    Object.values(sectionRefs.current).forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  // --- 공통 스타일 (객체 형식) ---
  const sectionStyle = css({
    position: "relative",
    height: "100vh",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    scrollSnapAlign: "start",
    overflow: "hidden",
  });

  const overlayStyle = css({
    position: "absolute",
    inset: 0,
    background: "rgba(0, 0, 0, 0.4)",
    zIndex: 1,
  });

  const contentStyle = css({
    position: "relative",
    zIndex: 2,
    color: "white",
    textAlign: "center",
    padding: "0 20px",
  });

  return (
    <div
      css={css({
        height: "100vh",
        overflowY: "auto",
        scrollSnapType: "y mandatory",
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": {
          display: "none",
        },
      })}
    >
      {/* 사이드 내비게이션 */}
      <aside
        css={css({
          position: "fixed",
          right: "40px",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 100,
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
        })}
      >
        {[...data_main.map((d) => d.id), "contact"].map((id) => (
          <a
            key={id}
            href={`#${id}`}
            css={css({
              fontSize: "0.75rem",
              textDecoration: "none",
              color: activeSection === id ? "#fff" : "rgba(255,255,255,0.4)",
              fontWeight: activeSection === id ? "bold" : "normal",
              transition: "all 0.3s ease",
              textAlign: "right",
              "&::after": {
                content: '""',
                display: "inline-block",
                width: activeSection === id ? "30px" : "0px",
                height: "1px",
                background: "white",
                marginLeft: "10px",
                verticalAlign: "middle",
                transition: "width 0.3s ease",
              },
            })}
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById(id)
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            {id.toUpperCase()}
          </a>
        ))}
      </aside>

      {/* 메인 섹션들 */}
      {data_main.map((sec) => (
        <section
          key={sec.id}
          id={sec.id}
          ref={(el) => {
            sectionRefs.current[sec.id] = el;
          }}
          css={sectionStyle}
        >
          <Image
            src={`/images/${sec.id}.jpg`}
            alt={sec.id}
            fill
            priority={sec.id === "main"}
            style={{ objectFit: "cover" }}
          />
          <div css={overlayStyle} />

          <div css={contentStyle}>
            <div
              css={css({
                fontSize: "0.9rem",
                letterSpacing: "0.3em",
                marginBottom: "1rem",
              })}
            >
              {sec.view}
            </div>
            {sec.id !== "main" && (
              <div
                css={css({
                  width: "40px",
                  height: "1px",
                  background: "white",
                  margin: "1.5rem auto",
                })}
              />
            )}
            <h1
              css={css({
                fontSize: "clamp(2rem, 5vw, 4rem)",
                marginBottom: "1.5rem",
                whiteSpace: "pre-line",
              })}
            >
              {sec.title}
            </h1>
            {sec.content && (
              <p
                css={css({
                  fontSize: "1.2rem",
                  opacity: 0.8,
                  marginBottom: "2rem",
                })}
              >
                {sec.content}
              </p>
            )}
            {sec.id !== "main" && (
              <BlurredBgButton href={`/${sec.id}`} variant="outline">
                Detail →
              </BlurredBgButton>
            )}
          </div>
        </section>
      ))}

      {/* Contact 섹션 */}
      <section
        id="contact"
        ref={(el) => {
          sectionRefs.current["contact"] = el;
        }}
        css={sectionStyle}
      >
        <Image
          src="/images/contact.png"
          alt="contact"
          fill
          style={{ objectFit: "cover" }}
        />
        <div css={overlayStyle} />
        <div css={contentStyle}>
          <Image
            width={250}
            height={250}
            src="/logo/logo_white_text.png"
            alt="logo"
            // fill
            style={{ objectFit: "cover" }}
          />
          <ContactView />
        </div>
      </section>
    </div>
  );
}

function ContactView() {
  return (
    <div css={css({ marginTop: 50, textAlign: "left", color: "white" })}>
      {contactDataList.map((item) => (
        <ContactInfo key={item.label} label={item.label} value={item.value} />
      ))}
    </div>
  );
}
