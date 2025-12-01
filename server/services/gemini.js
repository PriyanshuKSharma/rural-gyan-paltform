const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateGeminiResponse(prompt, systemInstruction) {
    try {
        // For text-only input, use the gemini-2.0-flash model
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash"
        });

        // Prepend system instruction to the prompt since gemini-pro doesn't support it in config
        const fullPrompt = `${systemInstruction}\n\nUser Query: ${prompt}`;

        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini API Error:", error);
        throw error;
    }
}

module.exports = { generateGeminiResponse };
