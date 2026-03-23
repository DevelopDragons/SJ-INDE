/** @jsxImportSource @emotion/react */
"use client";

import { css } from "@emotion/react";
import { colors } from "@/src/styles/colors";
import PageTitle from "@/src/components/text/PageTitle";
import { FiMail, FiPhone, FiPrinter, FiMapPin, FiClock } from "react-icons/fi";
import { data_contact } from "@/public/data/contact";

export default function ContactPage() {
  const fallbackMapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
    data_contact.headquarter,
  )}&t=&z=16&ie=UTF8&iwloc=&output=embed`;

  return (
    <div css={contactPageWrapperStyle}>
      <PageTitle
        title={"CONTACT US"}
        subTitle={"성공적인 파트너십을 위한 첫 걸음, 언제든 연락주세요."}
      />

      <section css={contactContentSectionStyle}>
        <div css={containerStyle}>
          {/* 상단 퀵 정보 카드 */}
          <div css={quickContactGrid}>
            <div css={quickItemStyle}>
              <div className="icon">
                <FiPhone />
              </div>
              <div className="text">
                <label>TEL</label>
                <p>{data_contact.tel}</p>
              </div>
            </div>
            <div css={quickItemStyle}>
              <div className="icon">
                <FiPrinter />
              </div>
              <div className="text">
                <label>FAX</label>
                <p>{data_contact.fax}</p>
              </div>
            </div>
            <div css={quickItemStyle}>
              <div className="icon">
                <FiMail />
              </div>
              <div className="text">
                <label>EMAIL</label>
                <p>{data_contact.email}</p>
              </div>
            </div>
          </div>

          {/* 메인 섹션: 좌측 정보 / 우측 지도 */}
          <div css={mainContentGrid}>
            <div css={infoSideStyle}>
              <div css={sectionHeaderStyle}>
                <span className="tag">LOCATION</span>
                <h2>찾아오시는 길</h2>
              </div>

              <div css={detailInfoList}>
                <div css={detailItemStyle}>
                  <div className="icon-box">
                    <FiMapPin />
                  </div>
                  <div className="content">
                    <h4>Headquarter (본사)</h4>
                    <p>{data_contact.headquarter}</p>
                  </div>
                </div>

                {data_contact.branches.map((branch, idx) => (
                  <div css={detailItemStyle} key={idx}>
                    <div className="icon-box">
                      <FiMapPin />
                    </div>
                    <div className="content">
                      <h4>Branch Office (지사)</h4>
                      <p>{branch}</p>
                    </div>
                  </div>
                ))}

                <div css={detailItemStyle}>
                  <div className="icon-box">
                    <FiClock />
                  </div>
                  <div className="content">
                    <h4>Working Hours</h4>
                    <p>평일 09:00 - 18:00 (주말 및 공휴일 휴무)</p>
                  </div>
                </div>
              </div>

              <div css={noticeBoxStyle}>
                <p>※ 방문 전 미리 연락 주시면 원활한 상담이 가능합니다.</p>
              </div>
            </div>

            <div css={mapSideStyle}>
              <div css={mapWrapperStyle}>
                <iframe
                  src={fallbackMapUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  title="office-location"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// --- Styles ---

const contactPageWrapperStyle = css`
  padding-top: 80px;
`;

const contactContentSectionStyle = css`
  width: 100%;
  background-color: ${colors.white};
`;

const containerStyle = css`
  max-width: 1300px;
  margin: 0 auto;
  padding: 60px 2rem 120px 2rem;
  @media (max-width: 768px) {
    padding: 40px 1.5rem 80px 1.5rem;
  }
`;

const quickContactGrid = css`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-bottom: 80px;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 15px;
  }
`;

const quickItemStyle = css`
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 30px;
  background-color: ${colors.gray[100]};
  border-radius: 12px;
  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
    background-color: ${colors.white};
    border-radius: 50%;
    color: ${colors.primary};
    font-size: 1.2rem;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  }
  label {
    font-size: 0.75rem;
    font-weight: 700;
    color: ${colors.gray[500]};
    margin-bottom: 4px;
    display: block;
  }
  p {
    font-size: 1.1rem;
    font-weight: 600;
    color: ${colors.gray[800]};
  }
`;

const mainContentGrid = css`
  display: grid;
  grid-template-columns: 1fr 1.5fr; /* 지도를 조금 더 넓게 배치 */
  gap: 80px;
  align-items: flex-start;
  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
    gap: 50px;
  }
`;

const infoSideStyle = css`
  display: flex;
  flex-direction: column;
`;

const sectionHeaderStyle = css`
  margin-bottom: 40px;
  .tag {
    color: ${colors.primary};
    font-weight: 800;
    font-size: 0.85rem;
    letter-spacing: 0.1em;
  }
  h2 {
    font-size: 2rem;
    font-weight: 800;
    color: ${colors.gray[900]};
    margin-top: 8px;
  }
`;

const detailInfoList = css`
  display: flex;
  flex-direction: column;
  gap: 35px;
`;

const detailItemStyle = css`
  display: flex;
  gap: 20px;
  .icon-box {
    color: ${colors.primary};
    font-size: 1.4rem;
    margin-top: 3px;
  }
  .content {
    h4 {
      font-size: 1.1rem;
      font-weight: 700;
      color: ${colors.gray[800]};
      margin-bottom: 8px;
    }
    p {
      font-size: 1.05rem;
      line-height: 1.6;
      color: ${colors.gray[600]};
      word-break: keep-all;
    }
  }
`;

const noticeBoxStyle = css`
  margin-top: 50px;
  padding: 20px;
  background-color: ${colors.gray[100]};
  border-left: 4px solid ${colors.primary};
  p {
    font-size: 0.95rem;
    color: ${colors.gray[600]};
    font-weight: 500;
  }
`;

const mapSideStyle = css`
  width: 100%;
`;

const mapWrapperStyle = css`
  width: 100%;
  height: 550px; /* Inquiry가 빠진 만큼 지도를 시원하게 키움 */
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid ${colors.gray[200]};
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  @media (max-width: 768px) {
    height: 400px;
  }
`;
