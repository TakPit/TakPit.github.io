var newQuoteButton = document.querySelector('#js-new-quote').addEventListener('click', getQuote);
var answerButton = document.querySelector('#js-tweet').addEventListener('click', displayAnswer);

var apiEndpoint = 'https://trivia.cyberwisp.com/getrandomchristmasquestion';

let current = {
    question: "",
    answer: ""
}

async function getQuote() { // async function to fetch data from the API. Needed to be async to use await.

    const answerText = document.querySelector('#js-answer-text');
    answerText.textContent = "";

    try {
        const response = await fetch(apiEndpoint);

        if (!response.ok) {
            throw Error('Network response was not ok. Status: ' + response.statusText);
        }

        const json = await response.json();
        current.question = json.question;
        current.answer = json.answer;
        displayQuote(current.question);
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
    answerText.textContent = current.answer
}

getQuote();