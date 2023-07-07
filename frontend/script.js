//http://localhost:3000/
//https://ranges-fullstack.vercel.app


const addPair = () => {
  const pairsContainer = document.getElementById('pairs-container');

  const pairDiv = document.createElement('div');
  pairDiv.classList.add('pair'); // Set the class for pairDiv

  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.classList.add('name');
  nameInput.placeholder = 'Name';

  const firstNumberInput = document.createElement('input');
  firstNumberInput.type = 'number';
  firstNumberInput.classList.add('first-number');
  firstNumberInput.placeholder = 'First Number';

  const secondNumberInput = document.createElement('input');
  secondNumberInput.type = 'number';
  secondNumberInput.classList.add('second-number');
  secondNumberInput.placeholder = 'Second Number';

  const removeButton = document.createElement('button');
  removeButton.classList.add('remove-pair');
  removeButton.innerHTML = 'Clear';

  removeButton.addEventListener('click', () => {
    pairDiv.remove();
  });

  pairDiv.appendChild(nameInput);
  pairDiv.appendChild(firstNumberInput);
  pairDiv.appendChild(secondNumberInput);
  pairDiv.appendChild(removeButton);

  pairsContainer.appendChild(pairDiv);
};


const removePair = (pairDiv) => {
  pairDiv.remove();
};

const saveRanges = async () => {
  const pairs = [];

  const pairDivs = document.querySelectorAll('.pair');
  pairDivs.forEach((pairDiv) => {
    const nameInput = pairDiv.querySelector('.name');
    const firstNumberInput = pairDiv.querySelector('.first-number');
    const secondNumberInput = pairDiv.querySelector('.second-number');

    const pairName = nameInput.value.trim();
    const firstNumber = parseFloat(firstNumberInput.value);
    const secondNumber = parseFloat(secondNumberInput.value);

    if (pairName !== '' && !isNaN(firstNumber) && !isNaN(secondNumber)) {
      pairs.push({ pairName, firstNumber, secondNumber });
    }
  });

  if (pairs.length > 0) {
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
        showSuccessMessage('Ranges saved successfully!');

        // Remove dynamically created HTML elements
        const pairsContainer = document.getElementById('pairs-container');
        pairsContainer.innerHTML = '';

        // Clear input boxes
        const inputBoxes = document.querySelectorAll('input');
        inputBoxes.forEach((input) => {
          input.value = '';
        });
      } else {
        console.log('Error saving ranges');
        showErrorMessage('Error saving ranges. Please try again.');
      }
    } catch (error) {
      console.log('Error:', error.message);
      showErrorMessage('An error occurred. Please try again later.');
    }
  } else {
    showErrorMessage('Please enter valid pair values.');
  }
};


const showSuccessMessage = (message) => {
  const messageElement = document.getElementById('message');
  messageElement.classList.add('alert', 'alert-success');
  messageElement.textContent = message;
};

const showErrorMessage = (message) => {
  const messageElement = document.getElementById('message');
  messageElement.classList.add('alert', 'alert-danger');
  messageElement.textContent = message;
};


document.getElementById('add-pair').addEventListener('click', addPair);
document.getElementById('save-ranges').addEventListener('click', saveRanges);

const createTables = (pairs) => {
  const tableContainer = document.getElementById('pairs-table-container');
  tableContainer.innerHTML = '';

  const maxPairsPerRow = 4;
  let currentRow;

  pairs.forEach((pair, index) => {
    if (index % maxPairsPerRow === 0) {
      currentRow = document.createElement('div');
      currentRow.classList.add('row');
      tableContainer.appendChild(currentRow);
    }

    const col = document.createElement('div');
    col.classList.add('col');

    const table = document.createElement('table');
    table.classList.add('table', 'table-bordered');

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const pairHeader = document.createElement('th');
    pairHeader.colSpan = 4;
    pairHeader.textContent = `${pair.pairName} [${pair.firstNumber}, ${pair.secondNumber}]`;
    headerRow.appendChild(pairHeader);
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    const subHeaderRow = document.createElement('tr');

    const ascendingSubheader = document.createElement('th');
    ascendingSubheader.colSpan = 2;
    ascendingSubheader.textContent = 'Ascending Order';
    subHeaderRow.appendChild(ascendingSubheader);

    const descendingSubheader = document.createElement('th');
    descendingSubheader.colSpan = 2;
    descendingSubheader.textContent = 'Descending Order';
    subHeaderRow.appendChild(descendingSubheader);

    tbody.appendChild(subHeaderRow);

    const ascendingRange = pair.ascendingRange;
    const descendingRange = pair.descendingRange;
    const rowCount = Math.max(ascendingRange.length, descendingRange.length);

    for (let i = 0; i < rowCount; i++) {
      const row = document.createElement('tr');

      const ascendingIndexCell = document.createElement('td');
      ascendingIndexCell.classList.add('index-cell');
      if (i < ascendingRange.length) {
        ascendingIndexCell.textContent = ascendingRange[i].index;
      }
      row.appendChild(ascendingIndexCell);

      const ascendingValueCell = document.createElement('td');
      ascendingValueCell.classList.add('value-cell');
      if (i < ascendingRange.length) {
        ascendingValueCell.textContent = ascendingRange[i].value;
      }
      row.appendChild(ascendingValueCell);

      const descendingIndexCell = document.createElement('td');
      descendingIndexCell.classList.add('index-cell');
      if (i < descendingRange.length) {
        descendingIndexCell.textContent = descendingRange[i].index;
      }
      row.appendChild(descendingIndexCell);

      const descendingValueCell = document.createElement('td');
      descendingValueCell.classList.add('value-cell');
      if (i < descendingRange.length) {
        descendingValueCell.textContent = descendingRange[i].value;
      }
      row.appendChild(descendingValueCell);

      tbody.appendChild(row);
    }

    table.appendChild(tbody);
    col.appendChild(table);
    currentRow.appendChild(col);
  });
};

const fetchPairs = async () => {
  try {
    const response = await fetch('https://ranges-fullstack.vercel.app/get-ranges');
    const data = await response.json();

    if (response.ok) {
      const pairs = data.ranges;
      console.log(pairs);

      const messageElement = document.getElementById('message');

      if (!pairs || pairs.length === 0) {
        messageElement.classList.add('alert', 'alert-info');
        messageElement.textContent = 'No pairs found.';
      } else {
        messageElement.textContent = '';
        createTables(pairs);
      }
    } else {
      console.log('Error fetching pairs');
    }
  } catch (error) {
    console.log('Error:', error.message);
  }
};

fetchPairs();
