export const colors = {
  // Brand Colors
  primary: "#9e0012", // 로고 색상
  primaryHover: "#7e000e", // 어두운
  accent: "#b13241", // 연한

  // Neutral Colors (Grays)
  white: "#ffffff",
  black: "#111111", // 완전 블랙보다는 깊은 그레이가 눈이 편함
  background: "#111111", // 섹션 배경색

  gray: {
    100: "#f9fafb", // 최상단 배경, 아주 연한 회색
    200: "#f3f4f6", // 보조 배경, 구분선 (Light mode)
    300: "#e5e7eb", // 비활성화된 버튼 배경
    400: "#9ca3af", // 플레이스홀더, 보조 텍스트
    500: "#6b7280", // 일반적인 설명 텍스트 (Kicker, Labels)
    600: "#4b5563", // 강조된 설명 텍스트
    700: "#374151", // 다크 모드 텍스트, 카드 테두리
    800: "#1f2937", // 다크 모드 카드 배경, 오버레이
    900: "#111827", // 깊은 배경색, 거의 블랙
  },

  // State & Feedback
  overlay: "rgba(0, 0, 0, 0.4)", // 이미지 위 오버레이
  divider: "rgba(255, 255, 255, 0.2)", // 흰색 배경용 투명 구분선
} as const;

export type Colors = typeof colors;
