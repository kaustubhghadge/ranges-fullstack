const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors()); // Enable CORS
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://kaustubhghadge:GsgAF6neeD4ZG1c9@cluster-test.tbkeevz.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

// Define a schema for the pairs and ranges
const rangeSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  pairs: [
    {
      firstNumber: { type: Number },
      secondNumber: { type: Number },
      ascendingRange: [Number],
      descendingRange: [Number]
    }
  ]
}); 
  // Create a model based on the schema
  const Range = mongoose.model('Range', rangeSchema);

// Endpoint to save the range
app.post('/save-range', async (req, res) => {
  try {
    const { pairs } = req.body;

    const ranges = [];

    for (const pair of pairs) {
      const { firstNumber, secondNumber, nValue } = pair;

      // Calculate the standard deviation
      const x = Math.max(firstNumber, secondNumber);
      const y = Math.min(firstNumber, secondNumber);
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

      ranges.push({
        firstNumber,
        secondNumber,
        ascendingRange,
        descendingRange
      });
    }

    // Create a new range document
    const newRange = new Range({
      pairs: ranges
    });

    // Save the range document to the database
    await newRange.save();

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
app.get('/get-ranges', async (req, res) => {
  try {
    const range = await Range.findOne().sort({ date: -1 }).exec();
    if (!range) {
      return res.json({ ranges: [] });
    }
  
    const pairs = range.pairs
    // Create a new array to hold similar numbers
const similarNumbersArray = [];

// Compare arrays for each object in Pairs array
for (const pair of pairs) {
  const ascendingRange = pair.ascendingRange;
  const descendingRange = pair.descendingRange;

  // Find similar numbers between ascendingRange and descendingRange arrays
  for (let i = 0; i < pairs.length; i++) {
    const otherPair = pairs[i];
    if (pair._id !== otherPair._id) {
      const similarAscending = findSimilarNumbers(ascendingRange, otherPair.ascendingRange);
      const similarDescending = findSimilarNumbers(descendingRange, otherPair.descendingRange);

      similarNumbersArray.push({
        pairId1: pair._id,
        pairId2: otherPair._id,
        similarAscending,
        similarDescending
      });
    }
  }
}

console.log(similarNumbersArray);

    
    res.json({ ranges: pairs });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching ranges' });
  }
});



// Function to find the similar numbers between two arrays
function findSimilarNumbers(arr1, arr2) {
  const similarNumbers = [];

  for (const num1 of arr1) {
    if (arr2.includes(num1)) {
      similarNumbers.push(num1);
    }
  }

  return similarNumbers;
}


// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
