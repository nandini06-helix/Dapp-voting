 const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  position: { type: String, required: true },
  agenda: { type: String },
  imageUrl: { type: String },
  electionId: { type: String, required: true }, // 🆕 To separate by election
});

module.exports = mongoose.model("Candidate", candidateSchema);
