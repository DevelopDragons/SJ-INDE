"use client";

export default function WorkPage() {
  const services = [
    {
      title: "공간 기획 및 디자인",
      description:
        "브랜드 아이덴티티를 반영한 창의적이고 실용적인 공간 디자인을 제공합니다.",
      items: ["컨셉 개발", "공간 기획", "디자인 설계", "3D 시뮬레이션"],
    },
    {
      title: "인테리어 시공",
      description: "축적된 노하우와 전문 기술력으로 완벽한 시공을 보장합니다.",
      items: ["설계 검토", "자재 선정", "시공 관리", "품질 관리"],
    },
    {
      title: "프로젝트 관리",
      description:
        "프로젝트 전 과정을 체계적으로 관리하여 최상의 결과를 도출합니다.",
      items: ["일정 관리", "예산 관리", "품질 관리", "사후 관리"],
    },
  ];

  const process = [
    {
      step: "01",
      title: "상담 및 현장 조사",
      description: "고객의 요구사항을 파악하고 현장을 정밀하게 분석합니다.",
    },
    {
      step: "02",
      title: "컨셉 제안",
      description: "브랜드와 공간의 특성을 고려한 창의적인 컨셉을 제안합니다.",
    },
    {
      step: "03",
      title: "디자인 개발",
      description: "승인된 컨셉을 바탕으로 상세 디자인을 개발합니다.",
    },
    {
      step: "04",
      title: "시공 및 감리",
      description: "전문 시공팀이 설계도에 따라 정확하게 시공합니다.",
    },
    {
      step: "05",
      title: "완공 및 인도",
      description: "최종 점검 후 고객에게 완벽한 공간을 인도합니다.",
    },
    {
      step: "06",
      title: "A/S 및 사후관리",
      description: "완공 후에도 지속적인 관리와 지원을 제공합니다.",
    },
  ];

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative h-[50vh] bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">WORK</h1>
          <p className="text-xl text-gray-300">사업 분야</p>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-white">
        <div className="container-custom max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="text-4xl font-bold mb-6">사업 분야</h2>
            <div className="h-1 w-20 bg-accent mx-auto mb-8"></div>
            <p className="text-lg text-gray-600">
              SJ INDE는 다양한 분야에서 전문적인 서비스를 제공합니다
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-gray-50 p-8 rounded-lg hover:shadow-xl transition-shadow"
              >
                <div className="text-5xl font-bold text-accent mb-4 opacity-20">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <ul className="space-y-2">
                  {service.items.map((item, itemIndex) => (
                    <li
                      key={itemIndex}
                      className="flex items-center text-gray-700"
                    >
                      <span className="w-2 h-2 bg-accent rounded-full mr-3"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="py-24 bg-gray-50">
        <div className="container-custom max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="text-4xl font-bold mb-6">디자인 프로세스</h2>
            <div className="h-1 w-20 bg-accent mx-auto mb-8"></div>
            <p className="text-lg text-gray-600">
              체계적인 프로세스로 최상의 결과를 제공합니다
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {process.map((item, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-lg shadow-md relative overflow-hidden group hover:shadow-xl transition-all"
              >
                <div className="absolute top-0 right-0 text-8xl font-bold text-gray-100 opacity-50 -mr-4 -mt-4 group-hover:text-accent group-hover:opacity-20 transition-all">
                  {item.step}
                </div>
                <div className="relative z-10">
                  <div className="text-3xl font-bold text-accent mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-white">
        <div className="container-custom max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6">
            프로젝트를 시작할 준비가 되셨나요?
          </h2>
          <p className="text-xl mb-8 text-gray-300">
            SJ INDE와 함께 가치 있는 공간을 만들어보세요
          </p>
          <a
            href="/contact"
            className="inline-block px-12 py-4 bg-white text-primary font-bold rounded-none hover:bg-gray-100 transition-colors"
          >
            문의하기
          </a>
        </div>
      </section>
    </div>
  );
}
