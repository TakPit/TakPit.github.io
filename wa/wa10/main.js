// 1. COMPLETE VARIABLE AND FUNCTION DEFINITIONS

const customName = document.getElementById('customname');
const randomize = document.querySelector('.randomize');
const story = document.querySelector('.story');

function randomValueFromArray(array) {
    const random = Math.floor(Math.random() * array.length);
    return array[random];
}


// 2. RAW TEXT STRINGS

// const storyText = "It was 94 fahrenheit outside, so :insertx: went for a walk. When they got to :inserty:, they stared in horror for a few moments, then :insertz:. Bob saw the whole thing, but was not surprised — :insertx: weighs 300 pounds, and it was a hot day.";
const storyText = "The sun blazed at 94 degrees Fahrenheit as :insertx: stepped outside to blaze even harder than how our beautiful star was. After swinging around for a while, they stumbled into :inserty:. Without hesitation, they :insertz:, producing the cheerful reaction of the entire CU Boulder student community. Bob, sipping the usual 300 pounds cup of iced tea nearby, barely raised an eyebrow; after all, it was a Tuesday, and :insertx: always did stuff like this."

const insertX = [
    "Frodo Baggins",
    "P. Diddy",
    "Ari Gold"
];

const insertY = [
    "the word's end",
    "Anthony Pinter's office hours",
    "Vatican's restrooms"
];

const insertZ = [
    "summoned Margaret Thatcher corrupted soul",
    "joined the ISIS",
    "started singing Lady Gaga's 'Poker Face'"
];


// 3. EVENT LISTENER AND PARTIAL FUNCTION DEFINITION

randomize.addEventListener('click', result);

function result() {

    // 1.
    let newStory = storyText;

    // 2.
    const xItem = randomValueFromArray(insertX);
    const yItem = randomValueFromArray(insertY);
    const zItem = randomValueFromArray(insertZ);

    // 3.
    newStory = newStory.replaceAll(':insertx:', xItem);
    newStory = newStory.replaceAll(':inserty:', yItem);
    newStory = newStory.replaceAll(':insertz:', zItem);

    // 4.
    if (customName.value !== '') {
        const name = customName.value;
        newStory = newStory.replaceAll('Bob', name);
    }

    // 5.
    if (document.getElementById("uk").checked) {
        const weight = Math.round(300 * 0.0714286) + ' stone';
        const temperature = Math.round((94 - 32) * 5 / 9) + ' degrees centigrade';

        newStory = newStory.replaceAll('300 pounds', weight);
        newStory = newStory.replaceAll('94 degrees Fahrenheit', temperature);
    }

    // 6.
    story.textContent = newStory;
    story.style.visibility = 'visible';
}