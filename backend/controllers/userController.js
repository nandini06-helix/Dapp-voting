 const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "secret123";

const registerUser = async (req, res) => {
const { name, scholarId, email, metamask, password } = req.body;

try {
const userExists = await User.findOne({ email });
if (userExists)
return res.status(400).json({ message: "Email already registered" });


const hashedPassword = await bcrypt.hash(password, 10);

const newUser = new User({
  name,
  scholarId,
  email,
  metamask,
  password: hashedPassword,
});

await newUser.save();
res.status(201).json({ message: "User registered successfully" });
} catch (err) {
console.error("❌ Register Error:", err);
res.status(500).json({ message: "Server error" });
}
};

const loginUser = async (req, res) => {
const { email, password } = req.body;

try {
const user = await User.findOne({ email });
if (!user) return res.status(400).json({ message: "Invalid credentials" });


const isMatch = await bcrypt.compare(password, user.password);
if (!isMatch)
  return res.status(400).json({ message: "Invalid credentials" });

const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
  expiresIn: "3d",
});

res.status(200).json({ token });
} catch (err) {
console.error("❌ Login Error:", err); 
res.status(500).json({ message: "Server error", error: err.message });
}
};

module.exports = { registerUser, loginUser };