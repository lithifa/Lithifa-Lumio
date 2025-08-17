const mongoose = require('mongoose');

const SummarySchema = new mongoose.Schema({
  transcript: { type: String, required: true },
  prompt: { type: String },
  generatedSummary: { type: String },
  editedSummary: { type: String },
  recipients: [String],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Summary', SummarySchema);
