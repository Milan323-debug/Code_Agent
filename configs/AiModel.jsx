import { Code } from "lucide-react";

const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");

if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
    throw new Error("NEXT_PUBLIC_GEMINI_API_KEY is not set in environment variables");
}
  
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

// Create Gemini API client
  const genAI = new GoogleGenerativeAI(apiKey);
  
// Configure the model with proper settings
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: {
        temperature: 0.3,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 2048,
    },
    safetySettings: [
        {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
        },
    ],
});

// Helper function to retry failed API calls
async function retryOperation(operation, maxRetries = 3, delay = 1000) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await operation();
        } catch (error) {
            if (i === maxRetries - 1) throw error;
            console.log(`Attempt ${i + 1} failed, retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}

// Create chat sessions with retry capability
export const chatSession = {
    chat: null,
    async sendMessage(message) {
        return retryOperation(async () => {
            try {
                const result = await model.generateContent(message);
                if (!result.response) {
                    throw new Error("No response from AI model");
                }
                return {
                    response: {
                        text: () => result.response.text()
                    }
                };
            } catch (error) {
                console.error("Error in chatSession.sendMessage:", error);
                throw error;
            }
        });
    },
    resetHistory() {
        this.chat = null;
    }
};

export const GenAiCode = {
    async sendMessage(message) {
        return retryOperation(async () => {
            try {
                console.log("Generating code with prompt:", message);
                const result = await model.generateContent({
                    contents: [{
                        role: "user",
                        parts: [{ text: message }]
                    }],
                    generationConfig: {
                        temperature: 0.3,
                        topP: 0.8,
                        topK: 40,
                        maxOutputTokens: 2048,
                    }
                });
                
                if (!result.response) {
                    throw new Error("No response from AI model");
                }
                
                const text = result.response.text();
                console.log("Raw AI response:", text);
                
                // Try to parse the response as JSON directly first
                try {
                    const jsonResponse = JSON.parse(text);
                    return {
                        response: {
                            text: () => JSON.stringify(jsonResponse)
                        }
                    };
                } catch (parseError) {
                    console.error("Failed to parse direct JSON response:", parseError);
                }

                // If direct JSON parsing fails, try to find JSON in the response
                const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
                if (jsonMatch) {
                    try {
                        const jsonContent = jsonMatch[1].trim();
                        const jsonResponse = JSON.parse(jsonContent);
                        return {
                            response: {
                                text: () => JSON.stringify(jsonResponse)
                            }
                        };
                    } catch (parseError) {
                        console.error("Failed to parse JSON content:", parseError);
                    }
                }

                // If no valid JSON found, create a default response with properly escaped code
                const defaultResponse = {
                    projectTitle: "React Application",
                    explanation: "Default application structure",
                    files: {
                        "/App.js": {
                            code: "import React from 'react';\\nimport './styles.css';\\n\\nfunction App() {\\n  return (\\n    <div>\\n      <h1>Hello World</h1>\\n    </div>\\n  );\\n}\\n\\nexport default App;"
                        },
                        "/styles.css": {
                            code: "/* Add your styles here */"
                        }
                    },
                    generatedFiles: ["/App.js", "/styles.css"]
                };

                // Ensure all code strings are properly escaped
                Object.keys(defaultResponse.files).forEach(filePath => {
                    if (defaultResponse.files[filePath].code) {
                        defaultResponse.files[filePath].code = defaultResponse.files[filePath].code
                            .replace(/\\/g, '\\\\')  // Escape backslashes
                            .replace(/\n/g, '\\n')   // Escape newlines
                            .replace(/\r/g, '\\r')   // Escape carriage returns
                            .replace(/\t/g, '\\t')   // Escape tabs
                            .replace(/"/g, '\\"');   // Escape double quotes
                    }
                });

                return {
                    response: {
                        text: () => JSON.stringify(defaultResponse)
                    }
                };
                
            } catch (error) {
                console.error("Error in GenAiCode.sendMessage:", error);
                throw error;
            }
        });
    },
    resetHistory() {
        console.log("Code generation history reset");
    }
};
  
    // const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
    // console.log(result.response.text());
