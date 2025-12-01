const pdfParse = require("pdf-parse");

async function extractTextFromPDF(buffer) {
    try {
        const parsed = await pdfParse(buffer);
        return parsed.text;
    } catch (error) {
        console.error("PDF extraction error:", error);
        return "";
    }
}

module.exports = { extractTextFromPDF };
