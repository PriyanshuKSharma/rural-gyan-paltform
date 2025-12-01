const { Translate } = require("@google-cloud/translate").v2;

const translator = new Translate({
    key: process.env.GOOGLE_TRANSLATE_API_KEY
});

async function translateText(text, targetLang) {
    try {
        const [translation] = await translator.translate(text, targetLang);
        return translation;
    } catch (error) {
        console.error("Translation error:", error);
        return text; // Fallback to original text
    }
}

module.exports = { translateText };
