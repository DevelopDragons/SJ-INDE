import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-primary text-white py-12">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold mb-4">P&K INC</h3>
            <div className="space-y-2 text-gray-300">
              <p className="font-bold">(주)피엔케이아이엔씨</p>
              <p>주소 : 서울시 송파구 백제고분로 224, 창대빌딩 7층</p>
              <p>TEL : 02-2202-2480</p>
              <p>이메일 : pnkinc@pnkinc.co.kr</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Link
                  href="/company/overview"
                  className="block text-gray-300 hover:text-white transition-colors"
                >
                  Company
                </Link>
                <Link
                  href="/business/work"
                  className="block text-gray-300 hover:text-white transition-colors"
                >
                  Business
                </Link>
              </div>
              <div className="space-y-2">
                <Link
                  href="/projects"
                  className="block text-gray-300 hover:text-white transition-colors"
                >
                  Projects
                </Link>
                <Link
                  href="/contact"
                  className="block text-gray-300 hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
          <p>COPYRIGHT© 2022 (주)피엔케이아이엔씨. ALL RIGHTS RESERVED.</p>
        </div>
      </div>
    </footer>
  );
}
