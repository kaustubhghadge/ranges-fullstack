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

// const updatePairsTable = (pairs) => {
//   const pairsTableBody = document.querySelector('#pairs-table tbody');

//   pairsTableBody.innerHTML = '';

//   pairs.forEach((pair, index) => {
//     const { firstNumber, secondNumber, ascendingRange, descendingRange, nValue } = pair;

//     const row = document.createElement('tr');

//     const pairCell = document.createElement('td');
//     pairCell.textContent = `Pair ${index + 1}: [${firstNumber}, ${secondNumber}]`;

//     const rangeCell = document.createElement('td');
//     const rangeList = document.createElement('ul');
//     rangeList.classList.add('range-list');

//     ascendingRange.forEach((value) => {
//       const listItem = document.createElement('li');
//       listItem.textContent = value;
//       rangeList.appendChild(listItem);
//     });

//     const listItemSeparator = document.createElement('li');
//     listItemSeparator.classList.add('separator');
//     rangeList.appendChild(listItemSeparator);

//     descendingRange.forEach((value) => {
//       const listItem = document.createElement('li');
//       listItem.textContent = value;
//       rangeList.appendChild(listItem);
//     });

//     rangeCell.appendChild(rangeList);

//     row.appendChild(pairCell);
//     row.appendChild(rangeCell);

//     pairsTableBody.appendChild(row);
//   });
// };

const updatePairsTable = (pairs) => {
  const pairsTableBody = document.querySelector('#pairs-table tbody');

  pairsTableBody.innerHTML = '';

  // Create table rows for values
  const rowCount = Math.max(...pairs.map((pair) => pair.ascendingRange.length));
  for (let i = 0; i < rowCount; i++) {
    const row = document.createElement('tr');

    pairs.forEach((pair, index) => {
      const { firstNumber, secondNumber, ascendingRange, descendingRange } = pair;

      const cell = document.createElement('td');
      if (i === 0) {
        // Set pair number as table header
        cell.textContent = `Pair ${index + 1}: [${firstNumber}, ${secondNumber}]`;
        cell.classList.add('pair-header');
      } else {
         // Updated set range value
         const ascendingValue = i - 1 < ascendingRange.length ? ascendingRange[i - 1] : '';
         const descendingValue = i - 1 < descendingRange.length ? descendingRange[i - 1] : '';
         cell.textContent = `${ascendingValue} ${descendingValue}`;
      }

      row.appendChild(cell);
    });

    pairsTableBody.appendChild(row);
  }
};


const fetchPairs = async () => {
  try {
    const response = await fetch('https://ranges-fullstack.vercel.app/get-ranges');
    const data = await response.json();

    if (response.ok) {
      const pairs = data.ranges;

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

  
