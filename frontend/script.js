//http://localhost:3000/
//https://ranges-fullstack.vercel.app

document.addEventListener('DOMContentLoaded', () => {
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

        // Remove dynamically created HTML elements
        const pairsContainer = document.getElementById('pairs-container');
        const pairDivs = pairsContainer.getElementsByClassName('pair');

// Remove all pairDivs except the first one
while (pairDivs.length > 1) {
  pairDivs[1].remove();
}

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
  const messageModalLabel = document.getElementById('messageModalLabel');
  const messageModalText = document.getElementById('messageModalText');

  messageModalLabel.textContent = 'Success';
  messageModalText.textContent = message;

  $('#messageModal').modal('show');
};

const showErrorMessage = (message) => {
  const messageModalLabel = document.getElementById('messageModalLabel');
  const messageModalText = document.getElementById('messageModalText');

  messageModalLabel.textContent = 'Error';
  messageModalText.textContent = message;

  $('#messageModal').modal('show');
};


document.getElementById('add-pair').addEventListener('click', addPair);
document.getElementById('save-ranges').addEventListener('click', saveRanges);

/**Table with all values*/
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
const createRepeatedValuesTable = (repeatedValues) => {
  const tableContainer = document.getElementById('repeated-values-table-container');
  tableContainer.innerHTML = '';

  const table = document.createElement('table');
  table.classList.add('table', 'table-bordered');
  table.id = 'repeated-values-table'; // Assign unique ID to the table

  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  const columnOneHeader = document.createElement('th');
  columnOneHeader.textContent = 'Column One';
  headerRow.appendChild(columnOneHeader);
  const columnTwoHeader = document.createElement('th');
  columnTwoHeader.textContent = 'Column Two';
  headerRow.appendChild(columnTwoHeader);
  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');

  const matchingPairsRow = document.createElement('tr');
  const matchingPairsColumnOne = document.createElement('td');
  matchingPairsColumnOne.textContent = 'Matching Pairs:';
  matchingPairsRow.appendChild(matchingPairsColumnOne);
  const matchingPairsColumnTwo = document.createElement('td');
  matchingPairsColumnTwo.id = 'matching-pairs-column';
  matchingPairsRow.appendChild(matchingPairsColumnTwo);
  tbody.appendChild(matchingPairsRow);

  const matchingValuesRow = document.createElement('tr');
  matchingValuesRow.classList.add('matching-values'); // Add the matching-values class to the row
  const matchingValuesColumnOne = document.createElement('td');
  matchingValuesColumnOne.textContent = 'Matching Values:';
  matchingValuesRow.appendChild(matchingValuesColumnOne);
  const matchingValuesColumnTwo = document.createElement('td');
  matchingValuesRow.appendChild(matchingValuesColumnTwo);
  tbody.appendChild(matchingValuesRow);

  const numOfMatchingValuesRow = document.createElement('tr');
  const numOfMatchingValuesColumnOne = document.createElement('td');
  numOfMatchingValuesColumnOne.textContent = 'Number of Matching Values:';
  numOfMatchingValuesRow.appendChild(numOfMatchingValuesColumnOne);
  const numOfMatchingValuesColumnTwo = document.createElement('td');
  numOfMatchingValuesColumnTwo.classList.add('number-of-matching-values');
  numOfMatchingValuesRow.appendChild(numOfMatchingValuesColumnTwo);
  tbody.appendChild(numOfMatchingValuesRow);

  table.appendChild(tbody);
  tableContainer.appendChild(table);

  const saveTableContainer = document.createElement('div');
  saveTableContainer.classList.add('save-table-container');

  const tableTitle = document.createElement('h2');
  tableTitle.classList.add('editable-title');
  tableTitle.contentEditable = true; // Enable editing the table title
  tableTitle.textContent = 'Table Uno'; // Default table title
  saveTableContainer.appendChild(tableTitle);

  const saveTableName = document.createElement('button');
  saveTableName.classList.add('btn', 'btn-primary', 'save-table-button');
  saveTableName.textContent = 'Save Table';
  saveTableName.addEventListener('click', () => {
    saveValuesToBackend();
  });
  saveTableContainer.appendChild(saveTableName);

  const tableStyle = document.createElement('style');
  tableStyle.textContent = `
    .editable-title {
      display: inline-block;
      padding: 5px;
      border: 1px solid #ccc;
      border-radius: 3px;
      background-color: #f9f9f9;
      cursor: text;
    }
    .editable-title:focus {
      outline: none;
      box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
    }
    .btn-primary {
      background-color: #007bff;
      color: #fff;
      border: none;
      padding: 6px 12px;
      font-size: 16px;
      cursor: pointer;
    }
    .save-table-container {
      display: flex;
      gap: 10px;
      align-items: center;
    }
  `;

  tableContainer.appendChild(saveTableContainer);
  tableContainer.appendChild(tableStyle);

  const horizontalLine = document.createElement('hr');
  tableContainer.appendChild(horizontalLine);

  repeatedValues.forEach((item) => {
    item.pairs.forEach((pair) => {
      const pairName = pair.name;
      const numbers = pair.numbers;

      const pairText = document.createElement('span');
      pairText.textContent = `${pairName} - [${numbers}] `;
      matchingPairsColumnTwo.appendChild(pairText);
    });

    const values = item.repeatedValues.map((valueItem) => valueItem.value).join(', ');
    const valueText = document.createElement('span');
    valueText.textContent = values;
    matchingValuesColumnTwo.appendChild(valueText);
  });

  const numOfMatchingValuesElement = document.querySelector('.number-of-matching-values');
  numOfMatchingValuesElement.textContent = getTotalMatchingValues(repeatedValues);
};

const getTotalMatchingValues = (repeatedValues) => {
  let count = 0;
  repeatedValues.forEach((item) => {
    count += item.repeatedValues.length;
  });
  return count;
};


const fetchPairs = async () => {
  try {
    const response = await fetch('https://ranges-fullstack.vercel.app/get-ranges');
    const data = await response.json();

    if (response.ok) {
      const pairs = data.ranges;
      const repeatedValues = data.repeatedValues;
      console.log("These are all the values pulled from fetchPairs function");
      console.log(data);

      const messageElement = document.getElementById('message');

      if (!pairs || pairs.length === 0) {
        messageElement.classList.add('alert', 'alert-info');
        messageElement.textContent = 'No pairs found.';
      } else {
        messageElement.textContent = '';
        createTables(pairs);
        createRepeatedValuesTable(repeatedValues);
      }
    } else {
      console.log('Error fetching pairs');
    }
  } catch (error) {
    console.log('Error:', error);
  }
};

const saveValuesToBackend = () => {
  const tableNameElement = document.querySelector('.editable-title');
  const tableName = tableNameElement.textContent;

  const matchingPairsElements = document.querySelectorAll('#matching-pairs-column span');
  const matchingPairs = Array.from(matchingPairsElements).map((element) => element.textContent);

  const matchingValuesElements = document.querySelectorAll('#repeated-values-table .matching-values span');
  const matchingValues = Array.from(matchingValuesElements).flatMap((element) => {
    const values = element.textContent.trim().split(',').map((value) => parseFloat(value.trim()));
    console.log(values);
    return values;
  });

  const numberOfMatchingValuesElement = document.querySelector('.number-of-matching-values');
  const numberOfMatchingValues = parseInt(numberOfMatchingValuesElement.textContent.trim(), 10);

  const data = {
    tableName,
    matchingPairs,
    matchingValues,
    numberOfMatchingValues
  };

  fetch('https://ranges-fullstack.vercel.app/save-table', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then((response) => {
      if (response.ok) {
        console.log('Values saved successfully');
        showSuccessMessage('Table saved successfully!');

        const tableContainer = document.getElementById('pairs-table-container');
        tableContainer.classList.add('.d-none');
        fetchSavedTables();

      } else {
        console.log('Error saving values');
        showErrorMessage('Error saving table. Please try again.');
      }
    })
    .catch((error) => {
      console.log('Error:', error);
       showErrorMessage('An error occurred. Please try again later.');
    });
};

 // Helper function to get the key of the latest table based on timestamp
 const getLatestTableKey = (tables) => {
  let latestTimestamp = null;
  let latestTableKey = null;
  for (const tableKey in tables) {
    const table = tables[tableKey];
    if (!latestTimestamp || table.timestamp > latestTimestamp) {
      latestTimestamp = table.timestamp;
      latestTableKey = tableKey;
    }
  }
  return latestTableKey;
};



const createSavedTable = (tables) => {
  const tableContainer = document.getElementById('saved-tables');
  tableContainer.innerHTML = '';

  const dropdownContainer = document.getElementById('dropdown-container');
  const dropdownMenu = document.getElementById('dropdown-menu');

  // Clear existing dropdown menu items
  dropdownMenu.innerHTML = '';


  // Populate dropdown menu with items
  for (const tableKey in tables) {
    const table = tables[tableKey];
    const dropdownItem = document.createElement('li');
    dropdownItem.innerHTML = `<a class="dropdown-item" href="#" data-table-key="${tableKey}">${table.tableName}</a>`;
    dropdownMenu.appendChild(dropdownItem);
  }

 // Show the dropdown container
 dropdownContainer.classList.remove('d-none');

 // Add event listener to dropdown items
 dropdownMenu.addEventListener('click', (event) => {
  event.preventDefault();
  const selectedTableKey = event.target.getAttribute('data-table-key');
  if (selectedTableKey) {
    const selectedTable = tables[selectedTableKey];
    showTable(selectedTable);
  }
});

  dropdownContainer.appendChild(dropdownMenu);

  // tableContainer.appendChild(dropdownContainer);

  // Function to show the selected table
  const showTable = (tableData) => {

    tableContainer.innerHTML = '';
  
    const tableTitle = document.createElement('h5');
    tableTitle.textContent = tableData.tableName;
    tableContainer.appendChild(tableTitle);
  
    const table = document.createElement('table');
    //add table id here with the id that we get from tableData
    table.setAttribute("id", tableData.id);
    table.classList.add('table', 'table-bordered', 'saved-table');
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const columnOneHeader = document.createElement('th');
    columnOneHeader.textContent = 'Column One';
    headerRow.appendChild(columnOneHeader);
    const columnTwoHeader = document.createElement('th');
    columnTwoHeader.textContent = 'Column Two';
    headerRow.appendChild(columnTwoHeader);
    thead.appendChild(headerRow);
    table.appendChild(thead);
  
    const tbody = document.createElement('tbody');
  
    const matchingPairsRow = document.createElement('tr');
    const matchingPairsColumnOne = document.createElement('td');
    matchingPairsColumnOne.textContent = 'Matching Pairs:';
    matchingPairsRow.appendChild(matchingPairsColumnOne);
    const matchingPairsColumnTwo = document.createElement('td');
    matchingPairsColumnTwo.id = 'matching-pairs-columns';
    matchingPairsRow.appendChild(matchingPairsColumnTwo);
    tbody.appendChild(matchingPairsRow);
  
    const matchingValuesRow = document.createElement('tr');
    matchingValuesRow.classList.add('matching-values'); // Add the matching-values class to the row
    const matchingValuesColumnOne = document.createElement('td');
    matchingValuesColumnOne.textContent = 'Matching Values:';
    matchingValuesRow.appendChild(matchingValuesColumnOne);
    const matchingValuesColumnTwo = document.createElement('td');
    matchingValuesColumnTwo.id = 'matching-values-columns';
  
    matchingValuesRow.appendChild(matchingValuesColumnTwo);
    tbody.appendChild(matchingValuesRow);
  
    const numOfMatchingValuesRow = document.createElement('tr');
    const numOfMatchingValuesColumnOne = document.createElement('td');
    numOfMatchingValuesColumnOne.textContent = 'Number of Matching Values:';
    numOfMatchingValuesRow.appendChild(numOfMatchingValuesColumnOne);
    const numOfMatchingValuesColumnTwo = document.createElement('td');
    numOfMatchingValuesColumnTwo.classList.add('total-number-of-matching-values');
    numOfMatchingValuesRow.appendChild(numOfMatchingValuesColumnTwo);
    tbody.appendChild(numOfMatchingValuesRow);
  
    table.appendChild(tbody);
    tableContainer.appendChild(table);
  
    // Populate table with data (matching pairs and matching values)
    const matchingPairsColumnTwoData = document.getElementById('matching-pairs-columns');
    tableData.pairs.forEach((pair) => {
      const pairText = document.createElement('span');
      pairText.textContent = `${pair.name} - ${pair.numbers} `;
      matchingPairsColumnTwoData.appendChild(pairText);
    });
  
    const matchingValuesColumnTwoData = document.querySelector('#matching-values-columns');
    const values = tableData.matchingValues.map((val) => parseFloat(val))
    values.forEach((val) => {
      matchingValuesColumnTwoData.textContent = values.join(', ');
    });
    
  
    const numOfMatchingValuesElement = document.querySelector('.total-number-of-matching-values');
    numOfMatchingValuesElement.textContent = values.length

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('d-flex', 'justify-content-between', 'mt-3');

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.addEventListener('click', () => {

      /**Using below method to get the id of the table because, only one table is shown on the HTML as the table has to be selected from the dropdown list. If in the future we were to show all the tables on HTML list and wanted to delete one of the table, then below logic would fail */
      const t = document.querySelectorAll('table.saved-table');
      deleteTable(t[0].id);
    });
    buttonContainer.appendChild(deleteButton);

    const compareButton = document.createElement('button');
    compareButton.textContent = 'Compare';
    compareButton.classList.add('btn', 'btn-primary');
    compareButton.addEventListener('click', () => {
      // Add your functionality for the compare button here
      // This event listener can be modified based on your requirements
      showErrorMessage("This functionality is still a work in progress");
    });
    buttonContainer.appendChild(compareButton);

    tableContainer.appendChild(buttonContainer);
  };

  //Show the latest table by default
  // const latestTableKey = getLatestTableKey(tables);
  // if (latestTableKey) {
  //   const latestTable = tables[latestTableKey];
  //   const title = document.createElement('h5');
  //   title.textContent = 'Latest Table';
  //   showTable(latestTable);
  //   dropdownButton.textContent = latestTable.tableName;
  //   dropdownButton.classList.add('active');
  // }
};

const deleteTable = async (id) => {
  try {
    const response = await fetch('http://localhost:3000/delete-table', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id })
    });

    if (response.ok) {
      console.log('Table deleted successfully');
      fetchSavedTables();
    } else {
      console.log('Error deleting table');
      showErrorMessage('Error deleting table. Please try again.');
    }
  } catch (error) {
    console.log('Error:', error);
    showErrorMessage('An error occurred. Please try again later.');
  }
};


const fetchSavedTables = async () => {
  try {
    const response = await fetch('http://localhost:3000/saved-tables');
    const data = await response.json();

    console.log(data);

    if (data && data.tables) {
      createSavedTable(data.tables);
    } else {
      console.log('Invalid data format');
    }

    
    } 
   catch (error) {
    console.log('Error:', error);
  }
};


fetchSavedTables().then(() => {
  const dropdownContainer = document.getElementById('dropdown-container');
  dropdownContainer.classList.remove('d-none');
});
});

//fetchPairs()