const switchTab = tab => {
    console.log(`Hello! This is the ${tab} tab!`);

    let tabcontent = document.getElementsByClassName("tabcontent");
    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = 'none'
    }
    document.getElementById(tab).style.display = "";
} //tab-switching function, working
document.getElementById('snake-tab').click();//sets default page (home) on load

//individual scripts for each 'page' 
//first: calculator
//This version will use a grid system, allowing for easier positionion of buttons
//and even an adjustable answer area 'size'
//code from original calculator
let mathematics = [];
let history = [];
let reset = false;
let bottomText = document.getElementById('current')
let topText = document.getElementById('previous')
//updates display for NUMBERS
const number = button => {
    if (bottomText.innerHTML === '') {
        bottomText.innerHTML = button;
        reset = false;
    } else if (history.length === 1 && reset) {
        bottomText.innerHTML = button
        reset = false;
    } else {
        bottomText.innerHTML = bottomText.innerHTML + button;
    }
} 

//updates display for OPERATORS
const operator = button => {
    if (bottomText.innerHTML === '') {
        return
    } else
    mathematics.push(bottomText.innerHTML, button);
    topText.innerHTML = topText.innerHTML + ' ' + bottomText.innerHTML + ' ' + button;
    bottomText.innerHTML = '';
}

//special case for negative numbers
const negativeOp = button => {
    if (bottomText.innerHTML === '') {
        bottomText.innerHTML = button;
        reset = false;
    } else {
        mathematics.push(bottomText.innerHTML, button);
        topText.innerHTML = topText.innerHTML + ' ' + bottomText.innerHTML + ' ' + button;
        bottomText.innerHTML = '';
    }
}

//updates display when CLEARING 
const clearIt = () => {
    topText.innerHTML = '';
    bottomText.innerHTML = '';
    mathematics = [];
    history = [];
    reset = false;
}

//updates display when EQUALLING
const equality = () => {
    if (mathematics.length === 0) {
        return;
    }
    mathematics.push(parseFloat(bottomText.innerHTML));
    let y = mathematics.toString();
    let z = y.replace(/,/g, ' ');
    topText.innerHTML = '';
    bottomText.innerHTML = eval(z)
    history[0] = eval(z)
    mathematics = []
    reset = true;
}

//new button function, clearing last input
const deleteIt = () => {
    if (bottomText.innerHTML === '') {
        return;
    } else {
        bottomText.innerHTML = bottomText.innerHTML.slice(0, bottomText.innerHTML.length - 1)
    }
}
//second: snake
let snakeBoard = document.getElementById('snake-board')
let cSna = snakeBoard.getContext('2d');
let grid = 30;
let paused = true;
let snakeHead = []; //x,y co-ordinates for first block
let snakeBody = []; //multiple x,y co-ordinates for rest of body
const greatestSize = (direction) => {
    return parseInt(direction / grid) * grid
}
snakeBoard.width = greatestSize(window.innerWidth); //max size in order for proper movement
snakeBoard.height = greatestSize(window.innerHeight) - 90; //same thing but with bottom bar for controls

const draw = (x, y) => {
    cSna.fillStyle = 'rgba(255, 0, 0, 0.75)' 
    cSna.fillRect(x, y, grid, grid);
}

//script below is for buttons under the canvas
document.getElementById('snake-start').addEventListener('click', () => {
    document.getElementById('snake-start').style.width = '33vw'
    document.getElementById('snake-settings').style.width = '33vw'
    document.getElementById('snake-settings').style.display = 'block'
    document.getElementById('snake-pause').style.width = '33vw'
    document.getElementById('snake-pause').style.display = 'block'
    paused = false
})

document.getElementById('snake-pause').addEventListener('click', () => {
    if (paused === false) {    
        document.getElementById('snake-pause').style.width = '99vw'
        document.getElementById('snake-settings').style.display = 'none'
        document.getElementById('snake-start').style.display = 'none'
        paused = true;
    } else {
        document.getElementById('snake-pause').style.width = '33vw'
        document.getElementById('snake-settings').style.display = 'block'
        document.getElementById('snake-start').style.display = 'block'
        paused = false
    }
})
draw(snakeBoard.width/2, snakeBoard.height/2);
//third: shooter
let shooterBoard = document.getElementById('shooter-board')
let cSho = shooterBoard.getContext('2d');
shooterBoard.width = window.innerWidth;
shooterBoard.height = window.innerHeight;