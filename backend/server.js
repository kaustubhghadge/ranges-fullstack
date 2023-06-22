const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors()); // Enable CORS
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://kaustubhghadge:yY7OGipjkNPwJkMX@cluster0.ty55w9c.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

// ... Existing code ...
// Define a schema for the ranges
const rangeSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    ascendingRange: [Number],
    descendingRange: [Number],
    firstNumber:Number,
    secondNumber:Number,
    nValue:Number,
  });
  
  // Create a model based on the schema
  const Range = mongoose.model('Range', rangeSchema);

// Endpoint to save the range
app.post('/save-range', async (req, res) => {
  try {
    const { firstNumber, secondNumber, nValue } = req.body;

    // Determine the largest and smallest numbers
    let x, y;
    if (firstNumber > secondNumber) {
      x = firstNumber;
      y = secondNumber;
    } else {
      x = secondNumber;
      y = firstNumber;
    }

    // Calculate the standard deviation
    const SD = x - y;

    // Generate the ascending order range
    const ascendingRange = [];
    for (let i = 1; i <= nValue; i++) {
      const r = i * SD + nValue;
      ascendingRange.push(r);
    }

    // Generate the descending order range
    const descendingRange = [];
    for (let i = nValue; i >= 1; i--) {
      const r = i * SD - nValue;
      descendingRange.push(r);
    }

    // Create a new range document
    const newRange = new Range({
        firstNumber:x,
        secondNumber:y,
        nValue:nValue,
        ascendingRange: ascendingRange,
        descendingRange: descendingRange
    });

    // Save the range document to the database
    await newRange.save();

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ... Existing code ...

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
