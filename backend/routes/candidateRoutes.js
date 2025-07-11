const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const { addCandidate, getCandidates } = require("../controllers/candidateController");

router.post("/add", upload.single("image"), addCandidate);
router.get("/", getCandidates);

module.exports = router;
