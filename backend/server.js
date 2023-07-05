const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors()); // Enable CORS
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://kaustubhghadge:yY7OGipjkNPwJkMX@cluster0.ty55w9c.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

// Define a schema for the pairs and ranges
const rangeSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  pairs: [
    {
      pair: { type: Number },
      firstNumber: { type: Number },
      secondNumber: { type: Number },
      ascendingRange: [{ type: Number }],
      descendingRange: [{ type: Number }]
    }
  ]
}); 
  // Create a model based on the schema
  const Range = mongoose.model('Range', rangeSchema);

// Endpoint to save the range
app.post('/save-range', async (req, res) => {
  try {
    const rangeData = req.body; 
  
    const savedPairs = [];

    rangeData.forEach((rangeItem, index) => {
      const { firstNumber, secondNumber } = rangeItem;
     
      // Determine the largest and smallest numbers
      const x = Math.max(firstNumber, secondNumber);
      const y = Math.min(firstNumber, secondNumber);

      // Calculate the SD
      const SD = x - y;
      const numValues = 100; // Number of values to generate

      // Generate the ascending range array
      const ascendingRange = [];
      for (let i = 1; i <= numValues; i++) {
        ascendingRange.push(x + i * SD);
      }

      // Generate the descending range array
      const descendingRange = [];
      for (let i = 1; i <= numValues; i++) {
        descendingRange.push(y - i * SD);
      }

      // Create a new range document
      const newRange = new Range({
        pairs: [
          {
            pair: index + 1,
            firstNumber: firstNumber,
            secondNumber: secondNumber,
            ascendingRange: ascendingRange,
            descendingRange: descendingRange
          }
        ]
      });

      savedPairs.push(newRange);
    });

    // Save the range documents to the database
    await Range.insertMany(savedPairs);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/get-ranges', async (req, res) => {
  try {
    const numValuesToRetrieve = 10; // Number of values to retrieve for each pair

    const range = await Range.aggregate([
      { $unwind: "$pairs" },
      { $sort: { date: -1 } }, // Sort by date in descending order
      {
        $project: {
          pair: "$pairs.pair",
          firstNumber: "$pairs.firstNumber",
          secondNumber: "$pairs.secondNumber",
          ascendingRange: { $slice: ["$pairs.ascendingRange", numValuesToRetrieve] },
          descendingRange: { $slice: ["$pairs.descendingRange", numValuesToRetrieve] }
        }
      }
    ]).exec();
    

    if (!range || range.length === 0) {
      return res.json({ ranges: [] });
    }

    res.json({ ranges: range });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching ranges' });
  }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
