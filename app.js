

const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const errorHandler = require("errorhandler");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB using Mongoose
mongoose.connect(
  "mongodb+srv://aridane:s3G5f2UwSAugGJ3o@cluster0.kzmuqxw.mongodb.net/a25",
  { useNewUrlParser: true, useUnifiedTopology: true }
);
const db = mongoose.connection;

// Handle MongoDB connection errors
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// Define the account schema
const accountSchema = new mongoose.Schema({
  name: String,
  balance: Number,
});

// Create the Account model
const Account = mongoose.model("Account", accountSchema);

// Middleware
app.use(morgan("dev")); // Logging requests
app.use(bodyParser.json());

// Routes

// GET /accounts - Retrieve all accounts
app.get("/", async (req, res) => {
  try {
    const accounts = await Account.find();
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST /accounts - Create a new account
app.post("/accounts", async (req, res) => {
  try {
    const { name, balance } = req.body;
    const newAccount = new Account({ name, balance });
    const savedAccount = await newAccount.save();
    res.status(201).json(savedAccount);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// PUT /accounts/:id - Update an existing account
app.put("/accounts/:id", async (req, res) => {
  try {
    const accountId = req.params.id;
    const { balance } = req.body;
    const updatedAccount = await Account.findByIdAndUpdate(
      accountId,
      { balance },
      { new: true }
    );

    if (!updatedAccount) {
      return res.status(404).json({ error: "Account not found" });
    }

    res.json(updatedAccount);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// DELETE /accounts/:id - Delete an account
app.delete("/accounts/:id", async (req, res) => {
  try {
    const accountId = req.params.id;
    const deletedAccount = await Account.findByIdAndDelete(accountId);

    if (!deletedAccount) {
      return res.status(404).json({ error: "Account not found" });
    }

    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Error handler middleware
app.use(errorHandler());

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
