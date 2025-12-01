const { generateGeminiResponse } = require("./gemini");
const { translateText } = require("./translate");
const { processImage } = require("./vision");
const { extractTextFromPDF } = require("./pdf");
const { TUTOR_SYSTEM_PROMPT, createTutorPrompt } = require("./tutorPrompt");

async function handleTutorMessage(payload) {
    let extractedText = "";

    try {
        if (payload.type === "image") {
            // Assuming payload.file is a buffer or base64 string
            // Tesseract accepts Buffer, so we need to ensure it's a buffer.
            // If it comes from socket.io, it might be a Buffer or ArrayBuffer.
            extractedText = await processImage(payload.file);
        }
        else if (payload.type === "pdf") {
            extractedText = await extractTextFromPDF(payload.file);
        }
        else {
            extractedText = payload.message;
        }

        const translated = await translateText(extractedText, "en");

        const finalPrompt = createTutorPrompt(translated);



        const aiResponse = await generateGeminiResponse(finalPrompt, TUTOR_SYSTEM_PROMPT);

        return {
            response: aiResponse,
            extracted: extractedText
        };
    } catch (error) {
        console.error("AI Tutor Handler Error:", error);

        if (error.status === 429 || error.message.includes("429")) {
            return {
                response: "⚠️ **OpenAI Quota Exceeded**\n\nI am currently running in **Offline/Demo Mode** because your OpenAI API key has run out of credits.\n\nHere is a simulated response:\n\n" +
                    "This is where the AI explanation would appear. Since I cannot connect to the brain, I can't analyze your specific question right now, but the system architecture is working perfectly! 🚀\n\n" +
                    "**To fix this:** Please add credits to your OpenAI account at platform.openai.com/billing.",
                extracted: extractedText
            };
        }

        return {
            response: `I'm sorry, I encountered an error: ${error.message}`,
            extracted: extractedText,
            error: error.message
        };
    }
}

module.exports = { handleTutorMessage };
