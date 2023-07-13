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
// Define a schema for the pairs and ranges
const rangeSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  pairs: [
    {
      pairName: { type: String },
      firstNumber: { type: Number },
      secondNumber: { type: Number },
      ascendingRange: [
        {
          index: { type: Number },
          value: { type: Number }
        }
      ],
      descendingRange: [
        {
          index: { type: Number },
          value: { type: Number }
        }
      ]
    }
  ]
});
// Create a model based on the schema
const Range = mongoose.model('Range', rangeSchema);

// Define a schema for the table data
const tableSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  tableName: String,
  matchingPairs: [String],
  matchingValues: [String],
  numberOfMatchingValues: Number
});

// Create a model based on the schema for the "tables" collection
const Table = mongoose.model('Table', tableSchema);

// Endpoint to save the range
app.post('/save-range', async (req, res) => {
  try {
    const rangeData = req.body;

    if (!rangeData || rangeData.length === 0) {
      return res.status(400).json({ success: false, error: 'Range data is missing' });
    }

    const savedPairs = [];

    for (const rangeItem of rangeData) {
      const { pairName, firstNumber, secondNumber } = rangeItem;

      if (pairName === null || firstNumber === null || secondNumber === null) {
        return res.status(400).json({ success: false, error: 'Invalid range data' });
      }

      const x = Math.max(firstNumber, secondNumber);
      const y = Math.min(firstNumber, secondNumber);

      const SD = x - y;
      const numValues = 100;

      const ascendingRange = [];
      const descendingRange = [];

      for (let i = 1; i <= numValues; i++) {
        ascendingRange.push({ index: i, value: x + i * SD });
        descendingRange.push({ index: i, value: y - i * SD });
      }

      savedPairs.push({
        pairName: pairName,
        firstNumber: firstNumber,
        secondNumber: secondNumber,
        ascendingRange: ascendingRange,
        descendingRange: descendingRange
      });
    }

    const newRange = new Range({ pairs: savedPairs });
    await newRange.save();

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});


app.get('/get-ranges', async (req, res) => {
  try {
    const numValuesToRetrieve = 10;

    const range = await Range.aggregate([
      { $sort: { timestamp: -1 } }, // Sort by timestamp in descending order
      { $limit: 1 }, // Retrieve only the latest Range document
      {
        $project: {
          pairs: {
            $map: {
              input: "$pairs",
              as: "pair",
              in: {
                id: "$$pair._id",
                pairName: "$$pair.pairName",
                firstNumber: "$$pair.firstNumber",
                secondNumber: "$$pair.secondNumber",
                ascendingRange: { $slice: ["$$pair.ascendingRange", numValuesToRetrieve] },
                descendingRange: { $slice: ["$$pair.descendingRange", numValuesToRetrieve] }
              }
            }
          }
        }
      }
    ]);

    if (!range || range.length === 0) {
      return res.json({ ranges: [] });
    }
    const repeatedValues = findRepeatedValues({ranges: range[0].pairs});
    res.json({ranges: range[0].pairs, repeatedValues});
  } catch (error) {
    res.status(500).json({ error: 'Error fetching ranges' });
  }
});

// Endpoint to save the table
app.post('/save-table', async (req, res) => {
  try {
    const tableData = req.body;

    // Extract the required fields from tableData
    const { tableName, matchingPairs, matchingValues, numberOfMatchingValues } = tableData;

    // Create a new document to store the table data
    const tableDocument = new Table({
      tableName,
      matchingPairs,
      matchingValues,
      numberOfMatchingValues
    });

    // Save the table document to the collection
    await tableDocument.save();

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Error saving table' });
  }
});

// Endpoint to get the latest document
app.get('/saved-tables', async (req, res) => {
  try {
    const allTables = await Table.find().sort({ _id: -1 });

    if (allTables.length === 0) {
      return res.json({ tables: {} });
    }
    
    const tablesObject = {};
    allTables.forEach((table, index) => {
      tablesObject[`table${index + 1}`] = {
        id:table._id,
        tableName: table.tableName,
        pairs: table.matchingPairs.map(pair => {
          const [name, numbers] = pair.split(' - ');
          return {
            name: name.trim(),
            numbers: numbers.trim()
          };
        }),
        matchingValues: table.matchingValues.map(values => values.trim()),
        timestamp: table.timestamp
      };
    });
    
    res.json({ tables: tablesObject });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching the latest document' });
  }
});


function findRepeatedValues(data) {
  const repeatedValues = [];

  for (let i = 0; i < data.ranges.length; i++) {
    const currentRange = data.ranges[i];

    for (let j = i + 1; j < data.ranges.length; j++) {
      const comparedRange = data.ranges[j];

      const repeatedAscending = currentRange.ascendingRange.filter(currentObj =>
        comparedRange.ascendingRange.some(comparedObj =>
          Math.abs(comparedObj.value - currentObj.value) <= 0.75
        )
      );

      const repeatedDescending = currentRange.descendingRange.filter(currentObj =>
        comparedRange.descendingRange.some(comparedObj =>
          Math.abs(comparedObj.value - currentObj.value) <= 0.75
        )
      );

      if (repeatedAscending.length > 0 || repeatedDescending.length > 0) {
        const repeatedInfo = {
          repeatedValues: [],
          pairs: []
        };

        for (const valueObj of repeatedAscending) {
          repeatedInfo.repeatedValues.push({ index: valueObj.index, value: valueObj.value });
        }

        for (const valueObj of repeatedDescending) {
          repeatedInfo.repeatedValues.push({ index: valueObj.index, value: valueObj.value });
        }

        const pair1 = {
          id: currentRange.id,
          name: currentRange.pairName,
          numbers: `${currentRange.firstNumber}, ${currentRange.secondNumber}`
        };

        const pair2 = {
          id: comparedRange.id,
          name: comparedRange.pairName,
          numbers: `${comparedRange.firstNumber}, ${comparedRange.secondNumber}`
        };

        repeatedInfo.pairs.push(pair1);
        repeatedInfo.pairs.push(pair2);

        repeatedValues.push(repeatedInfo);
      }
    }
  }

  return repeatedValues;
}

app.post('/delete-table', async (req, res) => {
  try {
    const id = req.body.id;
    const result = await Table.findByIdAndDelete(id);
    if (result){
      res.status(200).json({ok:"Table Deleted"})
    }
  }
  catch(error){
    res.status(500).json({ error: 'Error deleting the table' });
  }
})


// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});