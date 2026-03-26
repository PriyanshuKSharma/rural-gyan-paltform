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
                response: "⚠️ **AI service is temporarily busy.** Please try again in a few seconds.",
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
