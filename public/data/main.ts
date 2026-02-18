export interface MainData {
  id: string;
  view: string;
  title: string;
  content: string;
  path: string;
}

export const data_main: MainData[] = [
  {
    id: "main",
    view: "WE DESIGN",
    title: "",
    content:
      "THE <b>FUTURE</b> OF <b>SPACE</b>\nWITH <b>VALUE</b> IN <b>MIND</b>",
    path: "",
  },
  {
    id: "company",
    view: "COMPANY",
    title: "선준아이디는",
    content: "<b>공간의 본질</b>을 설계하는<br/>디자인 스튜디오입니다.",
    path: "company/about",
  },
  {
    id: "business",
    view: "BUSINESS",
    title: "선준아이디의 비즈니스는",
    content:
      "<b>공간 기획</b>부터 <b>시공</b>까지<br/>브랜드와 사용자를 연결합니다.",
    path: "business/work",
  },
  {
    id: "projects",
    view: "PROJECTS",
    title: "",
    content: "선준아이디가 완성한<br/><b>감각적인 포트폴리오</b>",
    path: "projects",
  },
];
