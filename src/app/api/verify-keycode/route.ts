import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { keyCode } = await request.json();

    if (keyCode === "GenAi2025") {
      return NextResponse.json({ isValid: true });
    }

    return NextResponse.json({ isValid: false }, { status: 401 });
  } catch (error) {
    return NextResponse.json(
      { error: "キーコードの検証に失敗しました: " + error },
      { status: 500 }
    );
  }
}
