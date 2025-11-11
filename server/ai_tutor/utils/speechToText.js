const speech = require('@google-cloud/speech');

class SpeechToText {
  constructor() {
    // Initialize Google Cloud Speech client
    this.client = new speech.SpeechClient({
      keyFilename: process.env.GOOGLE_CLOUD_KEY_FILE, // Optional: use service account key
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID
    });
  }

  async transcribeAudio(audioBuffer, encoding = 'WEBM_OPUS', sampleRateHertz = 48000) {
    try {
      const request = {
        audio: {
          content: audioBuffer.toString('base64'),
        },
        config: {
          encoding: encoding,
          sampleRateHertz: sampleRateHertz,
          languageCode: 'en-US',
          alternativeLanguageCodes: ['hi-IN'], // Support Hindi
          enableAutomaticPunctuation: true,
        },
      };

      const [response] = await this.client.recognize(request);
      const transcription = response.results
        .map(result => result.alternatives[0].transcript)
        .join('\n');

      return transcription;
    } catch (error) {
      console.error('Speech to text error:', error);
      throw new Error('Failed to transcribe audio');
    }
  }

  // Fallback method using Web Speech API (client-side)
  getWebSpeechConfig() {
    return {
      continuous: true,
      interimResults: true,
      lang: 'en-US'
    };
  }
}

module.exports = new SpeechToText();