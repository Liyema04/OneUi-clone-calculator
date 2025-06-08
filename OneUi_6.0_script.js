// Page window : Open Animation
window.addEventListener('DOMContentLoaded', function() {
    // Start with back face visible
    document.getElementById("calcFlipCard").style.transform = "rotateY(0deg)";
    // Animate flip from back (welcome text) to front (calculator)
    anime({
        targets: '#calcFlipCard',
        rotateY: [0, 180],
        duration: 1200,
        easing: 'easeInOutSine'
    });

    // Add unit converter button listener
    document.getElementById('unitConvTab').addEventListener('click', function() {
        const loadingScreen = document.querySelector('.unitConvLoading-screen');
        loadingScreen.style.display = 'block';
        
        anime({
            targets: '#calcFlipCard',
            rotateY: [0, 180],
            duration: 1200,
            easing: 'easeInOutSine',
            complete: function() {
                document.querySelector('.calc-flip-front').style.display = 'none';
            }
        });
    });

    // Event listeners after DOM is loaded
    document.getElementById('historyBtn').addEventListener('click', showHistory);
    document.getElementById('closeHistoryBtn').addEventListener('click', hideHistory);
    document.getElementById('historyPopup').addEventListener('click', function(e) {
        if (e.target === this) hideHistory();
    });
});

// Calculator 
let newLine = true; // Boolean variable. Determines if the next thing the user types should be on a new line
let value1;
let currentOperator;
let history = [];

// Event handler for Decimal button is 
function decimalBtnPressed() {
    let inputBox = document.getElementById("inputBox");
    if (newLine) {
        inputBox.value = "0.";
        newLine = false;
    } else if(!inputBox.value.includes(".")) {
        inputBox.value += ".";
    }
} 


// Event handler for when any digit is pressed
function digitBtnPressed(button) {
    let inputBox = document.getElementById("inputBox");
    if(newLine) {
        inputBox.value = button;
        newLine = false;
    } else {
        let currentValue = inputBox.value;
        if (currentValue === "0") {
            inputBox.value = button;
        } else {
            inputBox.value = currentValue + button;
        }
    }    
}

// Event handler for when AC button is pressed
function btnACPressed() {
    document.getElementById("inputBox").value = 0;
    newLine = true;
}


// Event handler for when Operator button is pressed
function operatorBtnPressed(operator) { 
    currentOperator = operator;
    value1 = parseFloat(document.getElementById("inputBox").value); // changed to float
    newLine = true;
}

// Event handler for history button
function showHistory() {
    const popup = document.getElementById("historyPopup");
    const list = document.getElementById("historyList");
    list.innerHTML= '';
    if (history.length === 0) {
        list.innerHTML = '<li>No history yet.</li>';
    } else {
        history.slice().reverse().forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            list.appendChild(li);
        });
    }
    popup.style.display = 'flex';
}

function hideHistory() {
    document.getElementById("historyPopup").style.display = 'none';
}

// Show/hide scientific panel and toggle icons
document.getElementById('sciBtn').addEventListener('click', function() {
    const sciFuncRows = document.getElementById("sciFuncRows");
    const testTubeIcon = document.getElementById("testTubeIcon");
    const calcIcon = document.getElementById("calcIcon");

    if (sciFuncRows.style.display === 'none' || sciFuncRows.style.display === '') {
        sciFuncRows.style.display = 'table-row-group';
        testTubeIcon.style.display = 'none';
        calcIcon.style.display = 'block';
    } else {
        sciFuncRows.style.display = 'none';
        testTubeIcon.style.display = 'block';
        calcIcon.style.display = 'none';
    }
});

// Handle scientific function button press
function sciFuncPressed(func) {
    let inputBox = document.getElementById("inputBox");
    let value = parseFloat(inputBox.value);
    let result;
    switch(func) {
        case 'sin': 
            result = Math.sin(value);
            break; 
        case 'cos': 
            result = Math.cos(value);
            break;
        case 'tan': 
            result = Math.tann(value);
            break;        
        case 'sqrt': 
            result = Math.sqrt(value);
            break;
        case 'pow2': 
            result = Math.pow(value, 2);
            break;
        case 'pi': 
            result = Math.PI;
            break;        
        }
        inputBox.value = result;
        newLine = true;
}

// Event handler for Equals-To button
function equalsBtnPressed() {
    let value2 = parseFloat(document.getElementById("inputBox").value); // changed to float
    let finalTotal;

    switch(currentOperator) {
        case "+":
            finalTotal = value1 + value2;
            break;
        case "-":
            finalTotal = value1 - value2;
            break;
        case "/":
            finalTotal = value1 / value2;
            break;
        case "*":
            finalTotal = value1 * value2;
            break;        
    }
    let display = Number.isFinite(finalTotal) ? finalTotal : "Error"; // Error instance
    document.getElementById("inputBox").value = display;
    // Save to history
    if (currentOperator && !isNaN(value1) && !isNaN(value2)) {
        history.push(`${value1} ${currentOperator} ${value2} = ${display}`)
    } 
    value1 = 0;
    newLine = true;
}

// Try it out -> Button
document.getElementById('tryItBtn').addEventListener('click', function() {
    // Flip back to welcome text
    anime({
        targets: '#calcFlipCard',
        rotateY: [180, 0],
        duration: 1200,
        easing: 'easeInOutSine'
    });
});

// Unit Converter Button Click-Handler
document.getElementById('uniConvTab').addEventListener('click', function() {
    const loadingScreen = document.querySelector('.unitConvLoading-screen');
    loadingScreen.style.display = 'block';

    //Flip animation to loading screen
    anime({
        targets: '#calcFlipCard',
        rotateY: [0, 180],
        duration: 1200,
        easing: 'easeInOutSine',
        complete: function() {
            // Animation completed
            document.querySelector('.calc-flip-front').style.display = 'none';
        }
    }); 
});

//Flips back to calculator
function backToCalculator() {
    const loadingScreen = document.querySelector('.unitConvLoading-screen');
    document.querySelector('.calc-flip-front').style.display = 'flex';

    anime({
        targets: '#calcFlipCard',
        rotateY: [180, 0],
        duration: 1200,
        easing: 'easeInOutSine',
        complete: function() {
            loadingScreen.style.display = 'none';
        }
    });
} 

// Unit Conversion API 
$.ajax({
    method: 'GET',
    url: 'https://api.api-ninjas.com/v1/unitconversion?amount=5&unit=meter',
    headers: { 'X-Api-Key': 'pHYGjb+vE4E8BdiezPPiyg==twHfGOHrmoRanvxq'},
    contentType: 'application/json',
    success: function(result) {
        console.log(result);
    },
    error: function ajaxError(jqXHR) {
        console.error('Error: ', jqXHR.responseText);
    }
});