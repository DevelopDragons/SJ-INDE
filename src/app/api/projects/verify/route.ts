import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { password } = await req.json();
    const securePassword = process.env.ADMIN_UPLOAD_PASSWORD;

    if (!securePassword) {
      // ⚠️ JSON 응답을 명확히 전달
      return NextResponse.json(
        { message: "서버 환경변수(.env) 설정이 누락되었습니다." }, 
        { status: 500 }
      );
    }

    if (password !== securePassword) {
      // ⚠️ JSON 응답을 명확히 전달
      return NextResponse.json(
        { message: "비밀번호가 일치하지 않습니다." }, 
        { status: 401 }
      );
    }

    return NextResponse.json({ message: "인증 완료" }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "서버 내부 오류가 발생했습니다." }, 
      { status: 500 }
    );
  }
}