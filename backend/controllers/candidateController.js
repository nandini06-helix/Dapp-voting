 const Candidate = require("../models/Candidate");

// Add a new candidate
const addCandidate = async (req, res) => {
  try {
    const { name, position, agenda, electionId } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";

    const newCandidate = new Candidate({ name, position, agenda, imageUrl, electionId });
    await newCandidate.save();

    res.status(201).json({ message: "Candidate added successfully", candidate: newCandidate });
  } catch (error) {
    res.status(500).json({ error: "Failed to add candidate" });
  }
};

// Get candidates by electionId
const getCandidates = async (req, res) => {
  try {
    const { electionId } = req.query;

    if (!electionId) {
      return res.status(400).json({ error: "Missing electionId in query" });
    }

    const candidates = await Candidate.find({ electionId });
    res.status(200).json(candidates);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch candidates" });
  }
};

module.exports = {
  addCandidate,
  getCandidates,
};
