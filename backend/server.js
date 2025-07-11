 
 const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const candidateRoutes = require("./routes/candidateRoutes");
const userRoutes = require("./routes/userRoutes");
const authenticate = require("./middlewares/auth"); // 🔐 auth middleware

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/candidates", candidateRoutes);
app.use("/api", userRoutes);

// ✅ Protected Route Example
app.get("/api/protected", authenticate, (req, res) => {
  res.json({
    message: "✅ You accessed protected data!",
    userId: req.userId,
  });
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error("❌ MongoDB error:", err));
