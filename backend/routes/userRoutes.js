 const express = require("express");
const { registerUser, loginUser } = require("../controllers/userController");
const authenticate = require("../middlewares/auth");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/protected", authenticate, (req, res) => {
  res.json({ message: "Secure route accessed", userId: req.userId });
});

module.exports = router;
