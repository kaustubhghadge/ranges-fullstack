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

  const nValueInput = document.createElement('input');
  nValueInput.type = 'number';
  nValueInput.classList.add('n-value');
  nValueInput.placeholder = 'n Value';

  pairDiv.appendChild(firstNumberInput);
  pairDiv.appendChild(secondNumberInput);
  pairDiv.appendChild(nValueInput);
  

  pairsContainer.appendChild(pairDiv);
};



const saveRanges = async () => {
  const pairs = [];

  const pairDivs = document.querySelectorAll('.pair');
  pairDivs.forEach((pairDiv) => {
    const firstNumberInput = pairDiv.querySelector('.first-number');
    const secondNumberInput = pairDiv.querySelector('.second-number');
    const nValueInput = pairDiv.querySelector('.n-value');

    const firstNumber = parseFloat(firstNumberInput.value);
    const secondNumber = parseFloat(secondNumberInput.value);
    const nValue = parseInt(nValueInput.value);

    pairs.push({ firstNumber, secondNumber, nValue });
  });

  try {
    const response = await fetch('https://ranges-fullstack.vercel.app/save-range', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ pairs })
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
  headerRow.innerHTML = `
    <th colspan="2">Pair 1 [${pairs[0].firstNumber}, ${pairs[0].secondNumber}]</th>
    <th colspan="2">Pair 2 [${pairs[1].firstNumber}, ${pairs[1].secondNumber}]</th>
  `;
  pairsTable.appendChild(headerRow);

  // Create sub-header row for ascending and descending order
  const subHeaderRow = document.createElement('tr');
  subHeaderRow.innerHTML = `
    <th>Ascending Order</th>
    <th>Descending Order</th>
    <th>Ascending Order</th>
    <th>Descending Order</th>
  `;
  pairsTable.appendChild(subHeaderRow);

  // Create table body
  const pairsTableBody = document.createElement('tbody');

  const maxRowCount = Math.max(
    pairs[0].ascendingRange.length,
    pairs[0].descendingRange.length,
    pairs[1].ascendingRange.length,
    pairs[1].descendingRange.length
  );

  for (let i = 0; i < maxRowCount; i++) {
    const row = document.createElement('tr');

    // Pair 1 Ascending Range
    const pair1AscendingValue = pairs[0].ascendingRange[i] || '';
    const pair1AscendingCell = document.createElement('td');
    pair1AscendingCell.textContent = pair1AscendingValue;
    if (isSimilarNumber(pair1AscendingValue, pairs[1])) {
      pair1AscendingCell.style.backgroundColor = getRandomColor();
    }
    row.appendChild(pair1AscendingCell);

    // Pair 1 Descending Range
    const pair1DescendingValue = pairs[0].descendingRange[i] || '';
    const pair1DescendingCell = document.createElement('td');
    pair1DescendingCell.textContent = pair1DescendingValue;
    if (isSimilarNumber(pair1DescendingValue, pairs[1])) {
      pair1DescendingCell.style.backgroundColor = getRandomColor();
    }
    row.appendChild(pair1DescendingCell);

    // Pair 2 Ascending Range
    const pair2AscendingValue = pairs[1].ascendingRange[i] || '';
    const pair2AscendingCell = document.createElement('td');
    pair2AscendingCell.textContent = pair2AscendingValue;
    if (isSimilarNumber(pair2AscendingValue, pairs[0])) {
      pair2AscendingCell.style.backgroundColor = getRandomColor();
    }
    row.appendChild(pair2AscendingCell);

    // Pair 2 Descending Range
    const pair2DescendingValue = pairs[1].descendingRange[i] || '';
    const pair2DescendingCell = document.createElement('td');
    pair2DescendingCell.textContent = pair2DescendingValue;
    if (isSimilarNumber(pair2DescendingValue, pairs[0])) {
      pair2DescendingCell.style.backgroundColor = getRandomColor();
    }
    row.appendChild(pair2DescendingCell);

    pairsTableBody.appendChild(row);
  }

  pairsTable.appendChild(pairsTableBody);
};

// Helper function to check if a number exists in the given pair's ranges
const isSimilarNumber = (number, pair) => {
  const { ascendingRange, descendingRange } = pair;
  return (
    (typeof number === 'number' && ascendingRange.includes(number)) ||
    (typeof number === 'number' && descendingRange.includes(number))
  );
};

// Helper function to generate a random color
const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};



const fetchPairs = async () => {
  try {
    const response = await fetch('https://ranges-fullstack.vercel.app/get-ranges');
    const data = await response.json();

    if (response.ok) {
      const pairs = data.ranges;
      console.log(pairs);

      if (Array.isArray(pairs) && pairs.length<=0){
        document.getElementById('message').textContent = "No pairs retrieved from DB"
      }
      else{
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

  
