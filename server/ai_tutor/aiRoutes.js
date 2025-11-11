const express = require('express');
const { aiController, upload } = require('./aiController');
const { auth } = require('../middlewares/auth');

const router = express.Router();

// All routes require authentication
router.use(auth);

// POST /api/student/ai-tutor - Process AI query (text, image, voice, document)
router.post('/', upload.single('file'), aiController.processQuery);

// GET /api/student/ai-tutor/history - Get chat history
router.get('/history', aiController.getChatHistory);

// DELETE /api/student/ai-tutor/history - Clear chat history
router.delete('/history', aiController.clearChatHistory);

module.exports = router;