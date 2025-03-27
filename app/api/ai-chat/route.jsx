import { chatSession } from "@/configs/AiModel";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { prompt } = await req.json();
        
        if (!prompt) {
            return NextResponse.json(
                { error: "Prompt is required" },
                { status: 400 }
            );
        }

        console.log("Sending prompt to Gemini API:", prompt.substring(0, 100) + "...");
        
        const result = await chatSession.sendMessage(prompt);
        
        if (!result || !result.response) {
            throw new Error("Invalid response from Gemini API");
        }

        const AIresponse = result.response.text();
        
        if (!AIresponse) {
            throw new Error("Empty response from AI model");
        }

        console.log("Received response from Gemini API");
        return NextResponse.json({ result: AIresponse });
    } catch (error) {
        console.error("AI Chat Error:", error);
        
        // Check for specific error types
        if (error.message.includes("API key")) {
            return NextResponse.json(
                { error: "Invalid or missing API key. Please check your environment variables." },
                { status: 401 }
            );
        }
        
        if (error.message.includes("rate limit")) {
            return NextResponse.json(
                { error: "Rate limit exceeded. Please try again later." },
                { status: 429 }
            );
        }

        return NextResponse.json(
            { error: error.message || "Failed to generate response" },
            { status: 500 }
        );
    }
}