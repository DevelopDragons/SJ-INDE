/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { motion, Variant, Variants } from "framer-motion";
import { colors } from "../../styles/colors";
import { WorkCategory } from "@/public/data/work";

interface WorkCategoryCardProps {
  index: number;
  category: WorkCategory;
  variants: Variants;
}

export default function WorkCategoryCard({
  index,
  category,
  variants,
}: WorkCategoryCardProps) {
  const { icon: Icon, title, subTitle, description, items } = category;

  return (
    <motion.div css={categoryCardStyle} variants={variants}>
      {/* 아이콘 섹션 */}
      <div css={categoryIconWrapperStyle}>
        <Icon size={32} strokeWidth={1.5} color={colors.primary} />
      </div>

      {/* <div css={categoryNumberStyle}>{String(index + 1).padStart(2, "0")}</div> */}

      <h3 css={categoryCardTitleStyle}>{title}</h3>
      <h4 css={categoryCardSubTitleStyle}>{subTitle}</h4>
      <p css={categoryCardDescriptionStyle}>{description}</p>

      <ul css={categoryItemsListStyle}>
        {items.map((item, itemIndex) => (
          <li key={itemIndex} css={categoryItemStyle}>
            <span css={categoryItemBulletStyle} />
            {item}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

const categoryCardStyle = css`
  background-color: ${colors.gray[100]};
  padding: 2rem;
  border-radius: 0.5rem;
  transition: box-shadow 0.3s ease-in-out;

  &:hover {
    box-shadow:
      0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
`;

const categoryIconWrapperStyle = css`
  width: 60px;
  height: 60px;
  background-color: ${colors.white}; // 흰색 배경으로 아이콘 강조
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
`;

const categoryNumberStyle = css`
  font-size: 0.875rem;
  font-weight: 700;
  color: ${colors.accent};
  letter-spacing: 0.1em;
  margin-bottom: 0.5rem;
`;

const categoryCardTitleStyle = css`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${colors.gray[800]};
`;

const categoryCardSubTitleStyle = css`
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: ${colors.gray[700]};
`;

const categoryCardDescriptionStyle = css`
  color: ${colors.gray[600]};
  margin-bottom: 1.5rem;
`;

const categoryItemsListStyle = css`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const categoryItemStyle = css`
  display: flex;
  align-items: center;
  color: ${colors.gray[700]};
`;

const categoryItemBulletStyle = css`
  width: 0.5rem;
  height: 0.5rem;
  background-color: ${colors.accent};
  border-radius: 9999px;
  margin-right: 0.75rem;
  flex-shrink: 0;
`;
