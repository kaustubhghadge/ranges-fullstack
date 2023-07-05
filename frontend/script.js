const addPair = () => {
  const pairsContainer = document.getElementById('pairs-container');

  const pairDiv = document.createElement('div');
  pairDiv.classList.add('pair');

  const firstNumberInput = document.createElement('input');
  firstNumberInput.type = 'number';
  firstNumberInput.classList.add('first-number');
  firstNumberInput.placeholder = 'First Number';

  const secondNumberInput = document.createElement('input');
  secondNumberInput.type = 'number';
  secondNumberInput.classList.add('second-number');
  secondNumberInput.placeholder = 'Second Number';

  pairDiv.appendChild(firstNumberInput);
  pairDiv.appendChild(secondNumberInput);

  pairsContainer.appendChild(pairDiv);
};

const saveRanges = async () => {
  const pairs = [];

  const pairDivs = document.querySelectorAll('.pair');
  pairDivs.forEach((pairDiv) => {
    const firstNumberInput = pairDiv.querySelector('.first-number');
    const secondNumberInput = pairDiv.querySelector('.second-number');

    const firstNumber = parseFloat(firstNumberInput.value);
    const secondNumber = parseFloat(secondNumberInput.value);

    pairs.push({ firstNumber, secondNumber });
  });

  try {
    const response = await fetch('https://ranges-fullstack.vercel.app/save-range', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(pairs)
    });

    if (response.ok) {
      console.log('Ranges saved successfully');
      fetchPairs();
    } else {
      console.log('Error saving ranges');
    }
  } catch (error) {
    console.log('Error:', error.message);
  }
};

document.getElementById('add-pair').addEventListener('click', addPair);
document.getElementById('save-ranges').addEventListener('click', saveRanges);

const updatePairsTable = (pairs) => {
  const pairsTable = document.querySelector('#pairs-table');

  // Clear existing table
  pairsTable.innerHTML = '';

  // Create table header row
  const headerRow = document.createElement('tr');
  pairs.forEach((pair, index) => {
    const pairHeader = document.createElement('th');
    pairHeader.colSpan = 2;
    pairHeader.textContent = `Pair ${index + 1} [${pair.firstNumber}, ${pair.secondNumber}]`;
    headerRow.appendChild(pairHeader);
  });
  pairsTable.appendChild(headerRow);

  // Create sub-header row for ascending and descending order
  const subHeaderRow = document.createElement('tr');
  pairs.forEach(() => {
    const ascendingHeader = document.createElement('th');
    ascendingHeader.textContent = 'Ascending Order';
    subHeaderRow.appendChild(ascendingHeader);

    const descendingHeader = document.createElement('th');
    descendingHeader.textContent = 'Descending Order';
    subHeaderRow.appendChild(descendingHeader);
  });
  pairsTable.appendChild(subHeaderRow);

  // Create table body
  const pairsTableBody = document.createElement('tbody');

  const maxRowCount = pairs.reduce((max, pair) => {
    return Math.max(max, pair.ascendingRange.length, pair.descendingRange.length);
  }, 0);

  for (let i = 0; i < maxRowCount; i++) {
    const row = document.createElement('tr');

    pairs.forEach((pair) => {
      const pairAscendingValue = pair.ascendingRange[i] !== undefined ? pair.ascendingRange[i] : 0;
const pairAscendingCell = document.createElement('td');
pairAscendingCell.textContent = pairAscendingValue;
row.appendChild(pairAscendingCell);

const pairDescendingValue = pair.descendingRange[i] !== undefined ? pair.descendingRange[i] : 0;
const pairDescendingCell = document.createElement('td');
pairDescendingCell.textContent = pairDescendingValue;
row.appendChild(pairDescendingCell);
    });

    pairsTableBody.appendChild(row);
  }

  pairsTable.appendChild(pairsTableBody);
};

const fetchPairs = async () => {
  try {
    const response = await fetch('https://ranges-fullstack.vercel.app/get-ranges');
    const data = await response.json();

    if (response.ok) {
      const pairs = data.ranges;
      console.log(pairs);

      if (Array.isArray(pairs) && pairs.length <= 0) {
        document.getElementById('message').textContent = "No pairs retrieved from DB";
      } else {
        updatePairsTable(pairs);
      }
    } else {
      console.log('Error fetching pairs');
    }
  } catch (error) {
    console.log('Error:', error.message);
  }
};

//fetchPairs();
