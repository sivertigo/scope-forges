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
      model: "gpt-4",
      temperature: 0.7,
    });

    const response = completion.choices[0].message.content;
    if (!response) {
      throw new Error("No response from OpenAI");
    }

    const tables = JSON.parse(response).tables;
    return NextResponse.json({ tables });
  } catch (error) {
    console.error("Error generating ERD:", error);
    return NextResponse.json(
      { error: "Failed to generate ERD" },
      { status: 500 }
    );
  }
}
