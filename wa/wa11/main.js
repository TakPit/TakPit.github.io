const displayedImage = document.querySelector('.displayed-img');
const thumbBar = document.querySelector('.thumb-bar');

const btn = document.querySelector('button');
const overlay = document.querySelector('.overlay');

const altText = document.querySelector('.alt-text');

/* Declaring the array of image filenames */
const images = ['lago.png', `loco.png`, `zen.png`, `torino.png`, `special_guests.png`];
/* Declaring the alternative text for each image file */
const alts = {'lago.png': 'Lago', 'loco.png': 'LoCo', 'zen.png': 'Zen Hooked', 'torino.png': 'Torino', 'special_guests.png': 'Special guests'}

/* Looping through images */
for (const image of images) {
    const img = document.createElement('img');
    img.setAttribute('src', `images/${image}`);
    img.setAttribute('alt', alts[image]);
    thumbBar.appendChild(img);
}
thumbBar.addEventListener('click', function (event) {
    clickedImg = event.target;
      displayedImage.src = clickedImg.src;
      displayedImage.alt = clickedImg.alt;
      altText.textContent = clickedImg.alt;
  });

/* Wiring up the Darken/Lighten button */

btn.addEventListener('click', () => {
    if (btn.getAttribute('class') === "dark") {
        btn.setAttribute('class', "light");
        btn.textContent = "Lighten";
        overlay.style.backgroundColor = "rgb(0 0 0 / 50%)";
    } else {
        btn.setAttribute('class', "dark");
        btn.textContent = "Darken";
        overlay.style.backgroundColor = "rgb(0 0 0 / 0%)";
    }
});