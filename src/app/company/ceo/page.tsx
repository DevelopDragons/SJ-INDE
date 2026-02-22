"use client";

export default function CompanyCeoPage() {
  const clients = {
    automotive: [
      "Ferrari Korea",
      "Porsche Korea",
      "Mercedes-Benz Korea",
      "Maybach Korea",
      "BMW Korea",
      "Audi Korea",
      "Lamborghini Korea",
      "Maserati Korea",
    ],
    retail: [
      "NOP'S",
      "Ddagoo",
      "Starbucks Korea",
      "Blue Bottle Coffee",
      "The Coffee Bean",
      "Paul Bassett",
    ],
    fashion: [
      "Gucci Korea",
      "Louis Vuitton Korea",
      "Prada Korea",
      "Hermes Korea",
      "Chanel Korea",
      "Dior Korea",
    ],
    others: [
      "Shinsegae Department Store",
      "Lotte Department Store",
      "Hyundai Department Store",
      "Galleria Department Store",
      "Starfield Mall",
      "COEX Mall",
    ],
  };

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative h-[50vh] bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">CLIENTS</h1>
          <p className="text-xl text-gray-300">고객사</p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-white">
        <div className="container-custom max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24">
            <div className="text-center">
              <div className="text-5xl font-bold text-accent mb-2">150+</div>
              <p className="text-gray-600">완료 프로젝트</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-accent mb-2">50+</div>
              <p className="text-gray-600">파트너사</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-accent mb-2">98%</div>
              <p className="text-gray-600">고객 만족도</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-accent mb-2">24/7</div>
              <p className="text-gray-600">고객 지원</p>
            </div>
          </div>

          {/* Introduction */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">신뢰받는 파트너</h2>
            <div className="h-1 w-20 bg-accent mx-auto mb-8"></div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              SJ INDE는 국내외 유수의 글로벌 브랜드들과 파트너십을 맺고
              있습니다.
              <br />
              축적된 경험과 전문성을 바탕으로 각 브랜드의 아이덴티티를 완벽하게
              구현합니다.
            </p>
          </div>
        </div>
      </section>

      {/* Clients Grid */}
      <section className="py-24 bg-gray-50">
        <div className="container-custom max-w-6xl">
          {/* Automotive */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold mb-8 flex items-center">
              <span className="w-12 h-1 bg-accent mr-4"></span>
              자동차 브랜드
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {clients.automotive.map((client, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all hover:-translate-y-1 flex items-center justify-center text-center min-h-[120px]"
                >
                  <p className="font-semibold text-gray-800">{client}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Retail */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold mb-8 flex items-center">
              <span className="w-12 h-1 bg-accent mr-4"></span>
              리테일 & F&B
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {clients.retail.map((client, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all hover:-translate-y-1 flex items-center justify-center text-center min-h-[120px]"
                >
                  <p className="font-semibold text-gray-800">{client}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Fashion */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold mb-8 flex items-center">
              <span className="w-12 h-1 bg-accent mr-4"></span>
              패션 브랜드
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {clients.fashion.map((client, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all hover:-translate-y-1 flex items-center justify-center text-center min-h-[120px]"
                >
                  <p className="font-semibold text-gray-800">{client}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Others */}
          <div>
            <h3 className="text-3xl font-bold mb-8 flex items-center">
              <span className="w-12 h-1 bg-accent mr-4"></span>
              기타
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {clients.others.map((client, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all hover:-translate-y-1 flex items-center justify-center text-center min-h-[120px]"
                >
                  <p className="font-semibold text-gray-800">{client}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-24 bg-white">
        <div className="container-custom max-w-4xl">
          <h2 className="text-4xl font-bold mb-16 text-center">고객사 후기</h2>

          <div className="space-y-8">
            <div className="bg-gray-50 p-8 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="text-5xl text-accent mr-2">"</div>
                <div>
                  <h4 className="font-bold text-lg">Ferrari Korea</h4>
                  <p className="text-sm text-gray-600">마케팅 디렉터</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">
                SJ INDE와의 협업을 통해 우리 브랜드의 정체성을 완벽하게 구현한
                공간을 만들 수 있었습니다. 전문적인 접근과 세심한 배려가
                돋보였습니다.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="text-5xl text-accent mr-2">"</div>
                <div>
                  <h4 className="font-bold text-lg">Starbucks Korea</h4>
                  <p className="text-sm text-gray-600">매장개발팀장</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">
                체계적인 프로세스와 뛰어난 시공 품질로 항상 만족스러운 결과를
                얻고 있습니다. 신뢰할 수 있는 파트너입니다.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
