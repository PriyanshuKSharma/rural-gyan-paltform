const aiService = require('./aiService');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf|docx|mp3|wav|m4a/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

class AITutorController {
  async processQuery(req, res) {
    try {
      const { message, type = 'text' } = req.body;
      const studentId = req.user.id;

      if (!message && !req.file) {
        return res.status(400).json({
          success: false,
          message: 'Message or file is required'
        });
      }

      let processedMessage = message;
      let queryType = type;

      // Handle file uploads
      if (req.file) {
        const fileExtension = path.extname(req.file.originalname).toLowerCase();
        
        if (['.jpg', '.jpeg', '.png'].includes(fileExtension)) {
          queryType = 'image';
          processedMessage = `[Image uploaded: ${req.file.originalname}] ${message || 'Please analyze this image'}`;
        } else if (['.pdf', '.docx'].includes(fileExtension)) {
          queryType = 'document';
          processedMessage = `[Document uploaded: ${req.file.originalname}] ${message || 'Please analyze this document'}`;
        } else if (['.mp3', '.wav', '.m4a'].includes(fileExtension)) {
          queryType = 'voice';
          processedMessage = `[Audio uploaded: ${req.file.originalname}] ${message || 'Please transcribe and respond to this audio'}`;
        }
      }

      const result = await aiService.processQuery(studentId, processedMessage, queryType);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('AI Tutor Controller Error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to process query'
      });
    }
  }

  async getChatHistory(req, res) {
    try {
      const studentId = req.user.id;
      const { limit = 50 } = req.query;

      const history = await aiService.getChatHistory(studentId, parseInt(limit));

      res.json({
        success: true,
        data: history
      });
    } catch (error) {
      console.error('Get Chat History Error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve chat history'
      });
    }
  }

  async clearChatHistory(req, res) {
    try {
      const studentId = req.user.id;

      await aiService.clearChatHistory(studentId);

      res.json({
        success: true,
        message: 'Chat history cleared successfully'
      });
    } catch (error) {
      console.error('Clear Chat History Error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to clear chat history'
      });
    }
  }
}

module.exports = { 
  aiController: new AITutorController(),
  upload
};