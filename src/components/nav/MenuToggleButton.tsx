/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { colors } from "../../styles/colors";

export default function MenuToggleButton({
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <button onClick={onClick} css={buttonStyle}>
      {[1, 2, 3].map((i) => (
        <span key={i} css={lineStyle(isOpen, i)} />
      ))}
    </button>
  );
}

const buttonStyle = css({
  display: "none",
  background: "none",
  border: "none",
  cursor: "pointer",
  flexDirection: "column",
  gap: "6px",
  zIndex: 1100,
  "@media (max-width: 768px)": { display: "flex" },
});

const lineStyle = (isOpen: boolean, i: number) =>
  css({
    width: "24px",
    height: "2px",
    backgroundColor: colors.white,
    transition: "all 0.3s ease",
    ...(isOpen &&
      i === 1 && { transform: "rotate(45deg) translate(6px, 6px)" }),
    ...(isOpen && i === 2 && { opacity: 0 }),
    ...(isOpen &&
      i === 3 && { transform: "rotate(-45deg) translate(5px, -5px)" }),
  });
