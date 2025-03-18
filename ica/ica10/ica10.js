let btn = document.querySelector('button')

btn.addEventListener('click', showfighter)

function showfighter() {
    let fighter = document.querySelector("#myfighter");
    const input = prompt('Write the box name to choose the figther')
    
    let box1 = document.querySelector('#f1')
    let box2 = document.querySelector('#f2')

    if (input === 'box1') {
        box1.style.backgroundColor = 'red'
        box2.removeAttribute("style")
        document.getElementById("f2").innerHTML = "box2";
        fighter.textContent = 'Great! You chose box1, now click on it to disclose your fighter'
    } else if (input === 'box2') {
        box2.style.backgroundColor = 'blue'
        box1.removeAttribute("style")
        document.getElementById("f1").innerHTML = "box1";
        fighter.textContent = 'Great! You chose box2, now click on it to disclose your fighter'
    } else {
        let buttondiv = document.querySelector(".button");
        // previous thoughts
        // if (buttondiv.style.position === 'absolute') {
        //     buttondiv.style.position = 'relative';
        // } else {
        //     buttondiv.style.position = 'absolute';
        // }
        box1.removeAttribute("style")
        box2.removeAttribute("style")
        document.getElementById("f1").innerHTML = "box1";
        document.getElementById("f2").innerHTML = "box2";
        fighter.textContent = "Write what's in either of the two boxes brother"
    }

    box1.addEventListener('click', () => changeBackgroundToImage(box1));
    box2.addEventListener('click', () => changeBackgroundToImage(box2));

}

function changeBackgroundToImage(box) {
    if (box.style.backgroundColor === 'red') {
        box.style.backgroundImage = "url('f1.jpg')";
        box.style.backgroundSize = 'cover';
        box.style.backgroundColor = '';
        document.getElementById("f1").innerHTML = "";
    }
    else if (box.style.backgroundColor === 'blue') {
        box.style.backgroundImage = "url('f2.jpg')";
        box.style.backgroundSize = 'cover';
        box.style.backgroundColor = '';
        document.getElementById("f2").innerHTML = "";
    }
    let fighter = document.querySelector("#myfighter");
    fighter.textContent = "Here's your fighter. Good luck brother"
}