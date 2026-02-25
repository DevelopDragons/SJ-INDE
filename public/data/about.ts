interface About {
  desc: string;
  business: BusinessCategory[];
}

interface BusinessCategory {
  title: string;
  desc: string;
}

export const data_about: About = {
  desc: `우리는 건축과 인테리어를 기반으로 공간의 본질을 설계하는 디자인 스튜디오입니다.
  외장, 인테리어, 전시, 디스플레이, 가구, 그래픽에 이르기까지 공간 전반을 아우르며,
  기획부터 설계·시공·감리까지 전 과정을 통합적으로 수행합니다.
  건축의 맥락과 사용자의 경험, 브랜드의 가치를 균형 있게 담아 완성도 높은 공간을 구현합니다.`,
  business: [
    {
      title: "Exterior",
      desc: `건축 외장 디자인\n건축의 인상과 주변 맥락을 고려한 외장 계획`,
    },
    {
      title: "Interior",
      desc: `업무 · 상업 · 주거 · 전시 공간\n설계, 시공, 감리를 아우르는 통합 디자인`,
    },
    {
      title: "Exhibition",
      desc: `상설 및 기획 전시장\n공간의 목적에 맞춘 전시 기획과 구현`,
    },
    {
      title: "Display",
      desc: `패션샵 및 브랜드 디스플레이\n브랜드 아이덴티티를 반영한 공간 연출`,
    },
    {
      title: "Furniture",
      desc: `주문가구 및 사무가구\n공간에 최적화된 가구 디자인 및 제작`,
    },
    {
      title: "Computer Graphics",
      desc: `건축 · 인테리어 CG\n공간 이해를 돕는 실내외 3D 시뮬레이션`,
    },
  ],
};
