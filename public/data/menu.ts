export interface MenuProps {
  title: string;
  path: string;
  submenu?: MenuProps[];
}

export const menuItems: MenuProps[] = [
  {
    title: "COMPANY",
    path: "/company/about",
    submenu: [
      { title: "About Us", path: "/company/about" },
      { title: "History", path: "/company/history" },
      { title: "Organization", path: "/company/organization" },
    ],
  },
  { title: "BUSINESS", path: "/business" },
  { title: "PROJECTS", path: "/projects" },
  { title: "CONTACT", path: "/contact" },
];
