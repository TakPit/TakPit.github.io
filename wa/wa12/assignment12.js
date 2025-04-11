// Button event listeners
var newQuoteButton = document.querySelector('#js-new-quote').addEventListener('click', getQuote);
var answerButton = document.querySelector('#js-tweet').addEventListener('click', displayAnswer);
var submitGuessButton = document.querySelector('#js-submit-guess').addEventListener('click', checkGuess);

// Input and output elements
var guessInput = document.querySelector('#js-guess-input');
var guessResult = document.querySelector('#js-result-text');

var apiEndpoint = 'http://numbersapi.com/random/year?json';

let current = {
    question: "",
    answer: ""
};

// 🔄 Proxy-enabled fetch function
async function fetchViaProxy(url) {
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    try {
        const response = await fetch(proxyUrl + url);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Fetch failed via proxy:', error);
        throw error;
    }
}

async function getQuote() {
    const answerText = document.querySelector('#js-answer-text');
    answerText.textContent = "";
    guessResult.textContent = "";

    try {
        const json = await fetchViaProxy(apiEndpoint);
        current.text = json.text;
        current.number = json.number;

        const textWithoutNumber = current.text.replace(/^\d+\s/, '... ');
        displayQuote(textWithoutNumber);
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        alert('There was a problem fetching the quote. Please try again later.');
    }
}

function displayQuote(quote) {
    const quoteText = document.querySelector('#js-quote-text');
    quoteText.textContent = quote;
}

function displayAnswer() {
    const answerText = document.querySelector('#js-answer-text');
    answerText.textContent = current.number;
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

    guessInput.value = "";
}

getQuote(); // initial quote on page load
