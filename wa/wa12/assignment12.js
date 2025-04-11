var newQuoteButton = document.querySelector('#js-new-quote').addEventListener('click', getQuote);
var answerButton = document.querySelector('#js-show-answer').addEventListener('click', displayAnswer);
var submitGuessButton = document.querySelector('#js-submit-guess').addEventListener('click', checkGuess);

var guessInput = document.querySelector('#js-guess-input');
var guessResult = document.querySelector('#js-result-text');

const apiKey = 'rFTtwgFp0feaR13DgrYX7w==etcwezdPEqcTBzVT';


let current = {
    text: "",
    year: ""
};


async function getQuote() {
    const randomYear = Math.floor(Math.random() * (2020 - 1000 + 1)) + 1000;
    const apiEndpoint = `https://api.api-ninjas.com/v1/historicalevents?year=${randomYear}`;

    const answerText = document.querySelector('#js-answer-text');
    answerText.textContent = "";
    guessResult.textContent = "";

    try {
        const response = await fetch(apiEndpoint, {
            headers: {
                'X-Api-Key': apiKey
            }
        });

        if (!response.ok) {
            throw Error('Network response was not ok. Status: ' + response.statusText);
        }

        const data = await response.json();
        if (!data.length) {
            console.warn(`No events found for year ${randomYear}. Retrying...`);
            return getQuote();
        }

        const event = data[0];
        const year = event.year;
        const sentence = event.event;

        const regex = new RegExp(`\\b${year}\\b`);
        const question = sentence.replace(regex, '...');

        current.text = question;
        current.year = year;

        displayQuote(question);

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
    answerText.textContent = current.year;
}

function checkGuess() {
    const userGuess = guessInput.value.trim();

    if (userGuess === "") {
        guessResult.textContent = "Please enter a guess!";
        return;
    } else if (parseInt(userGuess) === parseInt(current.year)) {
        guessResult.textContent = `Great job! ${userGuess} is the correct year!`;
    } else {
        guessResult.textContent = 'Incorrect. Try again or click "Show me the answer!"';
    }

    guessInput.value = "";
}

getQuote();