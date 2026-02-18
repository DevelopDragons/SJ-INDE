/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Link from "next/link";
import { colors } from "../../styles/colors";
import { MenuProps } from "@/public/data/menu";

interface MobileNavProps {
  isOpen: boolean;
  menuItems: MenuProps[];
  onClose: () => void;
}

export default function MobileNav({
  isOpen,
  menuItems,
  onClose,
}: MobileNavProps) {
  return (
    <div css={overlayStyle(isOpen)}>
      {/* 닫기 버튼 */}
      <button onClick={onClose} css={closeButtonStyle}>
        <div css={closeIconStyle}>
          <span />
          <span />
        </div>
      </button>

      <nav css={navWrapper}>
        {menuItems.map((item) => (
          <div key={item.path} css={itemGroup}>
            <Link href={item.path} onClick={onClose} css={mainLinkStyle}>
              {item.title}
            </Link>

            {item.submenu && (
              <div css={submenuWrapper}>
                {item.submenu.map((sub) => (
                  <Link
                    key={sub.path}
                    href={sub.path}
                    onClick={onClose}
                    css={subLinkStyle}
                  >
                    {sub.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
}

// --- Styles ---

const overlayStyle = (isOpen: boolean) =>
  css({
    position: "fixed",
    inset: 0,
    backgroundColor: "#000",
    zIndex: 2000,
    display: "flex",
    alignItems: "center",
    padding: "0 40px",
    transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
    transform: isOpen ? "translateX(0)" : "translateX(100%)",
    visibility: isOpen ? "visible" : "hidden",
  });

const closeButtonStyle = css({
  position: "absolute",
  top: "30px",
  right: "30px",
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: "10px",
});

const closeIconStyle = css({
  position: "relative",
  width: "24px",
  height: "24px",
  "& span": {
    position: "absolute",
    top: "50%",
    left: 0,
    width: "100%",
    height: "1px",
    backgroundColor: "#fff",
    "&:first-of-type": { transform: "rotate(45deg)" },
    "&:last-child": { transform: "rotate(-45deg)" },
  },
});

const navWrapper = css({
  display: "flex",
  flexDirection: "column",
  gap: "2.5rem",
  width: "100%",
});

const itemGroup = css({
  display: "flex",
  flexDirection: "column",
  gap: "12px",
});

const mainLinkStyle = css({
  color: "#fff",
  fontSize: "2rem",
  fontWeight: 700,
  textDecoration: "none",
  letterSpacing: "-0.02em",
  "&:hover": { color: colors.primary },
});

const submenuWrapper = css({
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  paddingLeft: "4px",
});

const subLinkStyle = css({
  color: "#888",
  fontSize: "1rem",
  textDecoration: "none",
  transition: "color 0.2s ease",
  "&:hover": { color: "#fff" },
});
