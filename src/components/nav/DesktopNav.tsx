/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Link from "next/link";
import { colors } from "../../styles/colors";
import { MenuProps } from "@/public/data/menu";

export default function DesktopNav({
  menuItems,
  pathname,
}: {
  menuItems: MenuProps[];
  pathname: string;
}) {
  return (
    <nav css={navStyle}>
      {menuItems.map((item) => (
        <div key={item.path} css={menuItemWrapper}>
          <Link
            href={item.path}
            css={linkStyle(pathname.startsWith(item.path))}
          >
            {item.title}
          </Link>
          {item.submenu && (
            <div className="submenu" css={submenuStyle}>
              {item.submenu.map((sub) => (
                <Link key={sub.path} href={sub.path}>
                  {sub.title}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}

const navStyle = css({
  display: "flex",
  gap: "50px",
  marginLeft: "auto",
  height: "100%",
  "@media (max-width: 768px)": { display: "none" },
});

const menuItemWrapper = css({
  position: "relative",
  height: "100%",
  display: "flex",
  alignItems: "center",
  "&:hover .submenu": {
    opacity: 1,
    visibility: "visible",
    transform: "translateX(-50%) translateY(0)",
  },
});

const linkStyle = (isActive: boolean) =>
  css({
    fontSize: "0.9rem",
    fontWeight: 600,
    color: colors.white,
    textDecoration: "none",
    transition: "all 0.3s ease",
    "&:hover": { color: colors.primary },
    ...(isActive && { color: colors.primary }),
  });

const submenuStyle = css({
  position: "absolute",
  top: "100%",
  left: "50%",
  transform: "translateX(-50%) translateY(15px)",
  backgroundColor: "rgba(10, 10, 10, 0.98)",
  minWidth: "200px",
  padding: "20px 0",
  borderRadius: "8px",
  boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
  border: `1px solid ${colors.gray[800]}`,
  opacity: 0,
  visibility: "hidden",
  transition: "all 0.4s cubic-bezier(0.23, 1, 0.32, 1)",
  display: "flex",
  flexDirection: "column",
  "& a": {
    padding: "12px 30px",
    fontSize: "0.85rem",
    color: colors.gray[400],
    textDecoration: "none",
    transition: "all 0.3s ease",
    "&:hover": {
      color: colors.white,
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      paddingLeft: "35px",
    },
  },
});
