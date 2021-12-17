let active = 'home'
const switchTab = tab => {
    console.log(`Hello! This is the ${tab} tab!`);

    let tabcontent = document.getElementsByClassName("tabcontent");
    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = 'none'
    }
    document.getElementById(tab).style.display = "";
    active = tab;
    console.log(active)
} //tab-switching function, working
document.getElementById('shooter-tab').click();//sets default page (home) on load
//function for random color (rgba) ==> rgba(0-255, 0-255, 0-255, 0-1)
const randCol = () => {
    let r = Math.round, rr = Math.random, rrr = 255;
    //use variables for this: round(random()*255), which becomes: r(rr()*rrr)
    return 'rgba(' + r(rr()*rrr) + ',' + r(rr()*rrr) + ',' + r(rr()*rrr) + ',' + rr() + ')'
}
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
let fruitPos = [];
let length = 2; //length of snake, not including head
let dir = 1;
let randomColor = false;
let bruh = false
let sScore = 0;
let fruit = false;
let curDir = []; //keeps directional commands in an array, allowing for queued movements
const greatestSize = (direction) => {
    return parseInt(direction / grid) * grid
}
snakeBoard.width = greatestSize(window.innerWidth); //max size in order for proper movement
snakeBoard.height = greatestSize(window.innerHeight) - 4 * grid; //same thing but with bottom bar for controls



const draw = (x, y) => {
    if (randomColor === true) {
        cSna.fillStyle = randCol();
    } else {
    cSna.fillStyle = 'rgba(255,200,0,0.70)';
    }
    cSna.fillRect(x, y, grid, grid);
    snakeHead.push(x, y)
    if (snakeBody.length >= 2 * length) {
        cSna.clearRect(snakeBody[0], snakeBody[1], grid, grid)
        snakeBody.shift();
        snakeBody.shift();
    }
    if (snakeHead[0] === fruitPos[0] && snakeHead[1] === fruitPos[1]) {
        sScore++;
        length++;
        fruit = false; 
        cSna.clearRect(fruitPos[0], fruitPos[1], grid, grid)
        cSna.fillStyle = 'rgba(255,200,0,0.70)';
        cSna.fillRect(fruitPos[0], fruitPos[1], grid, grid);
        fruitPos = [];
    }
}

const drawFruit = (x, y) => {
    cSna.fillStyle = 'white'
    cSna.fillRect(x, y, grid, grid)
    fruitPos.push(x, y)
    console.log(fruitPos)
    fruit = true

}
const sLoop = () => {
    let newX, newY;
    if (curDir.length >= 1) {
        dir = curDir[curDir.length - 1]
        curDir.pop();
    } else {
        dir = dir
        curDir.pop()
    }

    if (dir === 1) {
        if (snakeHead[0] + grid >= snakeBoard.width) {
            newX = 0
            newY = snakeHead[1]
        } else {
            newX = snakeHead[0] + grid
            newY = snakeHead[1]
        }
    } else if (dir === 2) {
        if (snakeHead[0] <= 0) {
            newX = snakeBoard.width - grid
            newY = snakeHead[1]
        } else {
            newX = snakeHead[0] - grid
            newY = snakeHead[1]
        }
    } else if (dir === 3) {
        if (snakeHead[1] <= 0) {
            newX = snakeHead[0]
            newY = snakeBoard.height - grid
        } else {
            newX = snakeHead[0]
            newY = snakeHead[1] - grid
        }

    } else if (dir === 4) {
        if (snakeHead[1] + grid >= snakeBoard.height) {
            newX = snakeHead[0]
            newY = 0
        } else {
            newX = snakeHead[0]
            newY = snakeHead[1] + grid
        }
    }
    draw(newX, newY);
    snakeBody.push(snakeHead[0], snakeHead[1])
    snakeHead.shift()
    snakeHead.shift()
    if (paused === true) {
        document.getElementById('snake-start').innerHTML = `HIGHSCORE: ${sScore} CLICK TO RESTART`
    } else {
        document.getElementById('snake-start').innerHTML = `SCORE: ${sScore}`
    }
}



//script below is for buttons under the canvas
document.getElementById('snake-start').addEventListener('click', () => {
    if (paused === true) {
        sScore = 0;
        document.getElementById('snake-start').style.width = '33vw'
        document.getElementById('snake-start').innerHTML = 'IN PROGRESS'
        document.getElementById('snake-settings').style.width = '33vw'
        document.getElementById('snake-settings').style.display = 'block'
        document.getElementById('snake-pause').style.width = '33vw'
        document.getElementById('snake-pause').style.display = 'block'
        paused = false
        cSna.clearRect(0, 0, snakeBoard.width, snakeBoard.height)
        draw(300, 450);
        const sOver = () => {
            length = 2;
            dir = 1;
            snakeHead = [];
            snakeBody = [];
            cSna.clearRect(snakeBoard.width, snakeBoard.height, 0, 0)
            paused = true;
            fruit = false;
            fruitPos = []
            document.getElementById('snake-start').style.width = '99vw'
            document.getElementById('snake-start').style.display = 'block'
            document.getElementById('snake-settings').style.display = 'none'
            document.getElementById('snake-pause').style.display = 'none'
            document.getElementById('random-color').style.display = 'none'
            clearInterval(sInterval);
            clearInterval(fInterval);
            document.getElementById('snake-start').innerHTML = `HIGHSCORE: ${sScore} RESTART`
            console.log('GAME OVER!')
        }
        let sInterval = setInterval(()=> {
            if (paused === true) {
                return
            } else if (active !=='snake') {
                cSna.clearRect(snakeBoard.width, snakeBoard.height, 0, 0)
                sOver();
                return
            } else {
                for (let i = snakeBody.length - 1; i >= 0; i-=2) {
                    if (snakeHead[0] === snakeBody[i-1] && snakeHead[1] === snakeBody[i]) {
                        sOver();
                    }
                }
                sLoop()
            }
        }, 100)
        let fInterval = setInterval(()=> {
            if (fruitPos.length < 2) {
                drawFruit(Math.floor(Math.random()*snakeBoard.width/grid) * grid, Math.floor(Math.random()*snakeBoard.height/grid) * grid)
            }
        }, 250)
    }
})

document.getElementById('snake-pause').addEventListener('click', () => {
    if (paused === false) {    
        document.getElementById('snake-pause').innerHTML = 'RESUME'
        document.getElementById('snake-start').innerHTML = 'PAUSED'
        paused = true;
        console.log('paused!')
    } else {
        document.getElementById('snake-start').innerHTML = 'IN PROGRESS'
        document.getElementById('snake-pause').innerHTML = 'PAUSE'
        paused = false
        console.log('playing!')
    }
})

document.getElementById('snake-settings').addEventListener('click', () => {
    if (bruh === true) {
        document.getElementById('snake-settings').innerHTML = 'SETTINGS';
        document.getElementById('snake-settings').style.width = '33vw';
        document.getElementById('snake-start').style.display = 'block';
        document.getElementById('snake-pause').style.display = 'block';
        document.getElementById('random-color').style.display = 'none';
        bruh = false
    } else {
        document.getElementById('random-color').style.width = '50vw';
        document.getElementById('random-color').style.display = 'block';
        document.getElementById('snake-settings').style.width = '50vw';
        document.getElementById('snake-pause').style.display = 'none';
        document.getElementById('snake-start').style.display = 'none';
        document.getElementById('snake-settings').innerHTML = 'RETURN'
        bruh = true
    }
  
})

document.getElementById('random-color').addEventListener('click', () => {
    if (randomColor === false) {
        document.getElementById('random-color').innerHTML = 'RANDOM COLORS: ON'
        randomColor = true;
    } else {
        document.getElementById('random-color').innerHTML = 'RANDOM COLORS: OFF'
        randomColor = false;
    }
})


document.addEventListener('keydown', key => {
    switch (key.code) {
        case 'KeyA':
            if (dir === 1 || dir === 2) {
                return
            } else {
                curDir.unshift(2)
            }
            break;
        case 'KeyS':
            if (dir === 3 || dir === 4) {
                return
            } else {
                curDir.unshift(4)
            }
            break;
        case 'KeyD':
            if (dir === 2 || dir === 1) {
                return
            } else {
                curDir.unshift(1)
            }
            break;
        case 'KeyW':
            if (dir === 4 || dir === 3) {
                return
            } else {
                curDir.unshift(3)
            }
            break;
        case 'ArrowLeft':
            if (dir === 1 || dir === 2) {
                return
            } else {
                curDir.unshift(2)
            }
            break;
        case 'ArrowDown':
            if (dir === 3 || dir === 4) {
                return
            } else {
                curDir.unshift(4)
            }
            break;
        case 'ArrowRight':
            if (dir === 2 || dir === 1) {
                return
            } else {
                curDir.unshift(1)
            }
            break;
        case 'ArrowUp':
            if (dir === 4 || dir === 3) {
                return
            } else {
                curDir.unshift(3)
            }
                break;
        default:
            break;
    }
})


//third: shooter
let shooterBoard = document.getElementById('shooter-board')
let cSho = shooterBoard.getContext('2d');
shooterBoard.width = window.innerWidth;
shooterBoard.height = window.innerHeight - 5 * grid;


//player follows mouse
//reminder for self: Math.atan2(y,x)
document.getElementById('shooter-board').addEventListener('mousemove', (mouse) => {
    let player = document.getElementById('shooter-player');
    let boundRect = player.getBoundingClientRect();
    let playerCenter = {
        x: boundRect.left + boundRect.width/2,
        y: boundRect.top + boundRect.height/2
    };
    let angle = Math.atan2(mouse.y - shooterBoard.height/2, mouse.x - shooterBoard.width/2) * (180 / Math.PI);
    player.style.transform = 'rotate(' + (angle + 50) + 'deg)';
    
})

class Projectile {
    constructor() {
        
    }
}
