interface Contact {
  tel: string;
  fax: string;
  email: string;
  headquarter: string;
  branches: string[];
}

interface ContactDataSet {
  label: string;
  value: string | string[];
}

export const data_contact: Contact = {
  tel: "02-441-0121",
  fax: "02-441-0122",
  email: "sunjunid@naver.com",
  headquarter: "서울시 강남구 강남대로 320, 1108호",
  branches: ["경기도 하남시 감초로 184번길 65"],
};

export const contactDataList: ContactDataSet[] = [
  { label: "TEL", value: data_contact.tel },
  { label: "FAX", value: data_contact.fax },
  { label: "EMAIL", value: data_contact.email },
  {
    label: "ADDRESS",
    value: [
      `본사 • ${data_contact.headquarter}`,
      ...data_contact.branches.map((branch) => `지사 • ${branch}`),
    ],
  },
];
