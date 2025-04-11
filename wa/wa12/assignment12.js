var newQuoteButton = document.querySelector('#js-new-quote').addEventListener('click', getQuote);
var answerButton = document.querySelector('#js-tweet').addEventListener('click', displayAnswer);
// Submit guess button
var submitGuessButton = document.querySelector('#js-submit-guess').addEventListener('click', checkGuess);
// Submission input field
var guessInput = document.querySelector('#js-guess-input');
// Result text field
var guessResult = document.querySelector('#js-result-text');

var apiEndpoint = 'http://numbersapi.com/random/year?json';

let current = {
    question: "",
    answer: ""
}

async function getQuote() { // async function to fetch data from the API. Needed to be async to use await.

    const answerText = document.querySelector('#js-answer-text');
    answerText.textContent = "";
    guessResult.textContent = "";


    try {
        const response = await fetch(apiEndpoint);

        if (!response.ok) {
            throw Error('Network response was not ok. Status: ' + response.statusText);
        }

        const json = await response.json();
        current.text = json.text;
        current.number = json.number;

        const textWithoutNumber = current.text.replace(/^\d+\s/, '... '); // Removes the leading number and space
        displayQuote(textWithoutNumber);
    }

    catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        alert('There was a problem with the fetch operation:', error);
    }
}

function displayQuote(quote) {
    const quoteText = document.querySelector('#js-quote-text');
    quoteText.textContent = quote
}

function displayAnswer() {
    const answerText = document.querySelector('#js-answer-text');
    answerText.textContent = current.number
}


function checkGuess() {

    const userGuess = guessInput.value.trim();

    if (userGuess === "") {
        guessResult.textContent = "Please enter a guess!";
        return;
    } else if (parseInt(userGuess) === current.number) {
        guessResult.textContent = `Great job! ${userGuess} is the correct year!`;
    } else {
        guessResult.textContent = 'Incorrect. Try again or click "Show me the answer!"';
    }

    // Clear the input field after submission
    guessInput.value = "";
}

//



getQuote();