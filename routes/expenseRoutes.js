// routes/expenseRoutes.js
const express = require("express");
const Expense = require("../models/Expense");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// Add expense
router.post("/", auth, async (req, res) => {
  try {
    const { category, amount, date, description } = req.body;
    if (!category || amount == null || !date) return res.status(400).json({ message: "Missing required fields" });

    const expense = new Expense({ userId: req.user.id, category, amount, date, description });
    await expense.save();
    res.json(expense);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get expenses (optionally by month/year)
router.get("/", auth, async (req, res) => {
  try {
    const filter = { userId: req.user.id };
    // you can enhance with query params (e.g., ?from=2025-01-01&to=2025-01-31)
    const expenses = await Expense.find(filter).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Delete expense
router.delete("/:id", auth, async (req, res) => {
  try {
    const e = await Expense.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!e) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted", e });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
