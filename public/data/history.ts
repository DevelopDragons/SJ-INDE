interface HistoryEvent {
  month: number;
  day: number;
  content: string;
}

interface HistoryItem {
  year: string;
  events: HistoryEvent[];
}

export const data_history: HistoryItem[] = [
  {
    year: "PRESENT", // 최상단 현재 표시
    events: [],
  },
  {
    year: "2018",
    events: [{ month: 8, day: 1, content: "㈜선준아이디 법인 전환" }],
  },
  {
    year: "2013",
    events: [
      { month: 4, day: 1, content: "선준아이디 전환" },
      { month: 3, day: 1, content: "회사 CI 전환" },
    ],
  },
  {
    year: "2009",
    events: [{ month: 1, day: 6, content: "서원디자인㈜ 설립" }],
  },
];
