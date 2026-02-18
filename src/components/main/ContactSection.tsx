/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Image from "next/image";
import { contactDataList } from "../../../public/data/contact";
import ContactInfo from "./ContactInfo";

interface ContactSectionProps {
  sectionRef: (el: HTMLElement | null) => void;
}

export default function ContactSection({ sectionRef }: ContactSectionProps) {
  return (
    <section id="contact" ref={sectionRef} css={sectionStyle}>
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
          style={{ objectFit: "contain", marginBottom: "20px" }}
        />

        <div css={contactListWrapper}>
          {contactDataList.map((item) => (
            <ContactInfo
              key={item.label}
              label={item.label}
              value={item.value}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// --- Styles ---
const sectionStyle = css({
  position: "relative",
  height: "100vh",
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  // scrollSnapAlign: "start", <- 이 부분 삭제 또는 주석 처리
  overflow: "hidden",
});

const overlayStyle = css({
  position: "absolute",
  inset: 0,
  background: "rgba(0, 0, 0, 0.6)", // 컨택트 섹션은 정보를 위해 조금 더 어둡게
  zIndex: 1,
});

const contentStyle = css({
  position: "relative",
  zIndex: 2,
  color: "white",
  textAlign: "center",
  padding: "0 20px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
});

const contactListWrapper = css({
  marginTop: "30px",
  textAlign: "left",
  width: "100%",
  maxWidth: 500, // 정보 정렬을 위해 너비 제한
  display: "flex",
  flexDirection: "column",
  gap: "10px",
});
