// Import express
import express from "express";
// Create express app
const app = express();

// Define port
const PORT = 5000;

// Middleware to parse JSON
app.use(express.json());

// Simple route
app.get("/", (req, res) => {
  res.send("Hello, Backend is working!");
});

// Example POST route
app.post("/data", (req, res) => {
  const { name } = req.body;
  res.send(`Received data for: ${name}`);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
