const Tesseract = require("tesseract.js");

async function processImage(fileBuffer) {
    try {
        const { data } = await Tesseract.recognize(fileBuffer, "eng");
        return data.text;
    } catch (error) {
        console.error("Vision processing error:", error);
        return "";
    }
}

module.exports = { processImage };
