export const colors = {
  // Brand Colors
  primary: "#2563eb", // 메인 블루 (Buttons, Links, Points)
  primaryHover: "#1d4ed8", // 호버 시 어두운 블루
  accent: "#60a5fa", // 강조용 연한 블루

  // Neutral Colors (Grays)
  white: "#ffffff",
  black: "#111111", // 완전 블랙보다는 깊은 그레이가 눈이 편함
  background: "#111111", // 섹션 배경색

  gray: {
    100: "#f3f4f6", // 아주 연한 배경
    200: "#e5e7eb",
    400: "#9ca3af", // 부가 설명 (Kicker, Labels)
    500: "#6b7280", // 비활성 사이드바 등
    700: "#374151",
    800: "#1f2937", // 오버레이나 카드 배경
  },

  // State & Feedback
  overlay: "rgba(0, 0, 0, 0.4)", // 이미지 위 오버레이
  divider: "rgba(255, 255, 255, 0.2)", // 흰색 배경용 투명 구분선
} as const;

export type Colors = typeof colors;
