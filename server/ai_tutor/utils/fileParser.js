const pdf = require('pdf-parse');
const mammoth = require('mammoth');

class FileParser {
  async parseFile(buffer, filename) {
    const extension = filename.toLowerCase().split('.').pop();
    
    switch (extension) {
      case 'pdf':
        return await this.parsePDF(buffer);
      case 'docx':
        return await this.parseDocx(buffer);
      case 'txt':
        return buffer.toString('utf-8');
      default:
        throw new Error(`Unsupported file type: ${extension}`);
    }
  }

  async parsePDF(buffer) {
    try {
      const data = await pdf(buffer);
      return data.text;
    } catch (error) {
      throw new Error('Failed to parse PDF file');
    }
  }

  async parseDocx(buffer) {
    try {
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    } catch (error) {
      throw new Error('Failed to parse DOCX file');
    }
  }
}

module.exports = new FileParser();