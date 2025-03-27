import { NextResponse } from "next/server";
import { GenAiCode } from "@/configs/AiModel";

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    console.log("Received prompt:", prompt);
    const result = await GenAiCode.sendMessage(prompt);
    
    if (!result || !result.response) {
      throw new Error("Invalid response from AI model");
    }

    const text = result.response.text();
    console.log("Raw response text:", text);

    // Try to parse the response as JSON
    try {
      const parsedResponse = JSON.parse(text);
      return NextResponse.json(parsedResponse);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      return NextResponse.json(
        { error: "Failed to parse AI response as JSON" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
