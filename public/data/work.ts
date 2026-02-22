import {
  MessageSquare,
  Search,
  Lightbulb,
  PenTool,
  HardHat,
  ShieldCheck,
  Layout,
  Building2,
  PencilRuler,
  Briefcase,
  Sofa,
  Users,
  LucideIcon,
} from "lucide-react";

export interface WorkCategory {
  title: string;
  subTitle: string;
  description: string;
  items: string[];
  icon: LucideIcon;
}

export interface WorkProcess {
  step: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export const data_work_category: WorkCategory[] = [
  {
    title: "실내건축공사업",
    subTitle: "Interior Architecture & Construction",
    description:
      "전문 건설 면허를 기반으로 주거, 상업, 업무 공간 등 모든 실내 건축 분야에서 최상의 시공 품질을 보장합니다.",
    items: [
      "신축 및 보수공사",
      "공정별 정밀 시공",
      "전문 기술인력 배치",
      "준공 및 인허가 업무",
    ],
    icon: Building2,
  },
  {
    title: "건물 리모델링",
    subTitle: "Building Transformation & Renovation",
    description:
      "노후화된 건축물의 가치를 재해석하여 구조 보강부터 외관 개선까지 아우르는 통합 리모델링 솔루션을 제안합니다.",
    items: [
      "구조 진단 및 보강",
      "외관 디자인 변경",
      "용도 변경 컨설팅",
      "에너지 효율 최적화",
    ],
    icon: Layout,
  },
  {
    title: "공간 기획 및 디자인",
    subTitle: "Spatial Strategy & Design",
    description:
      "브랜드 아이덴티티를 심도 있게 분석하여 창의적이고 실용적인 최적의 공간 경험을 설계합니다.",
    items: [
      "브랜드 경험 기획(BX)",
      "3D 가상 시뮬레이션",
      "VMD 및 스타일링",
      "디자인 표준화 수립",
    ],
    icon: PencilRuler,
  },
  {
    title: "디자인 컨설팅",
    subTitle: "Strategic Design Consulting",
    description:
      "사업성 분석부터 공간 활용 전략까지, 프로젝트 초기 단계에서 발생할 수 있는 리스크를 줄이고 가치를 높이는 전략을 제공합니다.",
    items: [
      "상권 분석 및 입지 전략",
      "공간 운영 매뉴얼",
      "시공 예산 수립",
      "프로젝트 마스터플랜",
    ],
    icon: Briefcase,
  },
  {
    title: "특화 요소 디자인",
    subTitle: "Bespoke Furniture & Signage",
    description:
      "공간의 완성도를 결정짓는 가구(FF&E)와 환경 사인시스템을 직접 디자인하고 제작하여 일관된 감도를 유지합니다.",
    items: [
      "주문제작 맞춤 가구",
      "인체공학적 집기 설계",
      "Wayfinding 시스템",
      "브랜드 사인 디자인",
    ],
    icon: Sofa,
  },
  {
    title: "전략적 파트너십",
    subTitle: "Creative Collaboration",
    description:
      "건축가, 아티스트, 브랜드와의 긴밀한 협업을 통해 경계를 허무는 새롭고 실험적인 프로젝트를 수행합니다.",
    items: [
      "아티스트 콜라보레이션",
      "브랜드 팝업 스토어",
      "복합 문화공간 기획",
      "글로벌 파트너십 연계",
    ],
    icon: Users,
  },
];

export const data_work_process: WorkProcess[] = [
  {
    step: "01",
    title: "사전 상담 및 가이드라인 수립",
    description:
      "고객의 비즈니스 목표와 요구사항을 심층 분석하고, 프로젝트의 예산 및 일정에 최적화된 초기 가이드라인을 제안합니다.",
    icon: MessageSquare,
  },
  {
    step: "02",
    title: "현장 정밀 조사 및 법규 검토",
    description:
      "대상 공간의 구조적 특성과 설비 현황을 실측하며, 관련 건축 법규 및 용도 변경 가능 여부를 철저히 검토하여 리스크를 사전 차단합니다.",
    icon: Search,
  },
  {
    step: "03",
    title: "기획 설계 및 디자인 컨셉 개발",
    description:
      "공간의 정체성을 담은 메인 테마를 설정하고, 효율적인 동선 계획(Zoning)과 무드보드를 통해 시각화된 디자인 방향성을 공유합니다.",
    icon: Lightbulb,
  },
  {
    step: "04",
    title: "상세 설계 및 기술 검토",
    description:
      "최종 확정된 디자인을 바탕으로 마감재 선정, 3D 시뮬레이션, 정밀 도면(평면, 입면, 상세도) 작성을 통해 완성도 높은 설계안을 도출합니다.",
    icon: PenTool,
  },
  {
    step: "05",
    title: "전문 시공 및 공정 관리",
    description:
      "숙련된 전문가들이 설계에 따라 정밀 시공을 진행하며, 실시간 공정 보고와 철저한 현장 감리를 통해 품질과 안전을 동시에 확보합니다.",
    icon: HardHat,
  },
  {
    step: "06",
    title: "최종 점검 및 지속적 케어",
    description:
      "완공 후 정밀 점검을 거쳐 프로젝트를 인도하며, 사후 유지 관리 지원 및 정기적인 A/S 서비스를 통해 공간의 가치를 지속적으로 유지합니다.",
    icon: ShieldCheck,
  },
];
