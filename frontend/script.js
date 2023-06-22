document.getElementById("rangeForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form submission
  
    // Get the input values
    const firstNumber = document.getElementById("firstNumber").value;
    const secondNumber = document.getElementById("secondNumber").value;
    const nValue = document.getElementById("nValue").value;
  
    // Create the request payload
    const payload = {
      firstNumber: parseFloat(firstNumber),
      secondNumber: parseFloat(secondNumber),
      nValue: parseInt(nValue)
    };
  
    // Make a POST request to the backend
    fetch("http://localhost:3000/save-range", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          alert("Range saved successfully!");
        } else {
          alert("Error saving range: " + data.error);
        }
      })
      .catch(error => {
        alert("Error saving range: " + error.message);
      });
  });
  