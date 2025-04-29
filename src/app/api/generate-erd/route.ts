import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    const prompt = `
以下のテキストからERDを生成してください。
カラムの型定義は、int8, varchar, text, timestamp, boolean, float, double, date などを使用してください。Supabaseの型定義参考.
テキスト: ${text}

以下の形式でJSONを返してください：
{
  "tables": [
    {
      "id": "ユニークなID",
      "name": "テーブル名",
      "columns": [
        {
          "id": "ユニークなID",
          "name": "カラム名",
          "type": "データ型",
          "isPrimaryKey": true/false,
          "isForeignKey": true/false,
          "foreignKeyReference": {
            "tableId": "参照先テーブルID",
            "columnId": "参照先カラムID"
          }
        }
      ]
    }
  ]
}
`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4o-mini",
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const response = completion.choices[0].message.content;
    if (!response) {
      throw new Error("No response from OpenAI");
    }

    // parseが失敗したらエラー。
    try {
      const tables = JSON.parse(response).tables;
      return NextResponse.json({ tables });
    } catch (error) {
      console.error("Error parsing JSON:", error);
      throw new Error("Failed to parse JSON response");
    }
  } catch (error) {
    console.error("Error generating ERD:", error);
    return NextResponse.json(
      { error: "Failed to generate ERD" },
      { status: 500 }
    );
  }
}
