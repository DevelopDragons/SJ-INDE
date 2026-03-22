export interface OrganizationNode {
  id: string;
  name: string;
  type: "root" | "department" | "team";
  children?: OrganizationNode[]; // 하위 조직을 무한히 확장 가능
}

export const data_organization: OrganizationNode = {
  id: "ceo",
  name: "대표이사",
  type: "root",
  children: [
    { id: "mgmt", name: "경영관리부", type: "department" },
    { id: "admin", name: "공무부", type: "department" },
    {
      id: "marketing",
      name: "마케팅부",
      type: "department",
      children: [{ id: "sales", name: "영업팀", type: "team" }],
    },
    {
      id: "design",
      name: "설계부",
      type: "department",
      children: [
        { id: "design_team", name: "설계팀", type: "team" },
        { id: "cg_team", name: "CG팀", type: "team" },
      ],
    },
    {
      id: "const",
      name: "공사부",
      type: "department",
      children: [
        { id: "const_mgmt", name: "공사관리팀", type: "team" },
        { id: "cs_mgmt", name: "CS관리팀", type: "team" },
      ],
    },
  ],
};
