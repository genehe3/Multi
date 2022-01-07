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
document.getElementById('home-tab').click();//sets default page (home) on load
document.getElementById('home').style.width=window.innerWidth;
document.getElementById('home').style.height=window.innerHeight

let tool  = document.getElementById('toolbar')
console.log(tool)
let hcanvas = document.getElementById('home-canvas')
let htx = hcanvas.getContext('2d')

const canvasOffsetX = hcanvas.offsetLeft;
const canvasOffsetY = hcanvas.offsetTop;

hcanvas.width = window.innerWidth - canvasOffsetX;
hcanvas.height = window.innerHeight - canvasOffsetY;

let painting = false;
let lineW = 5;
let startX;
let startY;

tool.addEventListener('click', e => {
    if (e.target.id === 'clear') {
        htx.clearRect(0,0,hcanvas.width,hcanvas.height)
        console.log('cleared!')
    }
})

tool.addEventListener('change', e => {
    if (e.target.id === 'stroke') {
        htx.strokeStyle = e.target.value;
    }

    if (e.target.id === 'lineWidth') {
        lineW = e.target.value;
    }
})

const hdraw = (e) => {
    if(painting === false) {
        return
    }

    htx.lineWidth = lineW;
    htx.lineCap = 'round'

    htx.lineTo(e.layerX - canvasOffsetX , e.layerY - canvasOffsetY)
    htx.stroke();

}

hcanvas.addEventListener('mousedown', e => {
    painting = true;
    startX = e.clientX;
    startY = e.clientY;
    console.log(canvasOffsetX, canvasOffsetY)
})

hcanvas.addEventListener('mouseup', e => {
    painting = false;
    htx.stroke();
    htx.beginPath();
})

hcanvas.addEventListener('mousemove', hdraw)



//function for random color (rgba) ==> rgba(0-255, 0-255, 0-255, 0-1)
const randCol = () => {
    let r = Math.round, rr = Math.random, rrr = 255;
    //use variables for this: round(random()*255), which becomes: r(rr()*rrr)
    return 'rgba(' + r(rr()*rrr) + ',' + r(rr()*rrr) + ',' + r(rr()*rrr) + ',' + rr() + ')'
}

const randColNoA = () => {
    let r = Math.round, rr = Math.random, rrr = 255;
    return 'rgba(' + r(rr()*rrr) + ',' + r(rr()*rrr) + ',' + r(rr()*rrr) + ', 1)'
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
shooterBoard.height = window.innerHeight - 2 * grid;

let enemies = [];
let projectiles = [];
let particles = [];
let shOver = true
let looping = false
let shoLoop
let spawnTimer = 700
let projVelMulti = 4
let partVelMulti = 1
let enemVelMulti = 1
let score = 0

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
    player.style.transform = 'rotate(' + (angle + 45) + 'deg)';

})

document.getElementById('shooter-start').addEventListener('click', () => {
    shOver = false;
    document.getElementById('shooter-player').style.display = 'block'
    document.getElementById('contained-container').style.display = 'none'
    cSho.clearRect(0, 0, shooterBoard.width, shooterBoard.height)
    if (looping === false) {
        looping = true;
        loop();
    }

})
const shoOver = () => {
    shOver = true;
    console.log('over!')
    cSho.clearRect(0,0,shooterBoard.width, shooterBoard.height)
    cSho.clearRect(0,0,shooterBoard.width, shooterBoard.height)
    document.getElementById('contained-container').style.display = 'flex'
    document.getElementById('shooter-state').innerHTML = `GOOD JOB. HIGHSCORE:${score}`
    document.getElementById('shooter-player').style.display = 'none'
    particles = []
    enemies = []
    projectiles = []
    score = 0

}

class Projectile {
    constructor(x, y, radius, velocity, color) {
        this.x = x
        this.y = y
        this.radius = radius
        this.velocity = velocity
        this.color = color
    }

    draw() {
        cSho.fillStyle = this.color
        cSho.beginPath()
        cSho.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        cSho.fill()
    }

    update() {
        this.x = this.x + this.velocity.x * 4
        this.y = this.y + this.velocity.y * 4
        this.draw()
    }
}

class Enemy {
    constructor(x, y, radius, velocity, color) {
        this.x = x
        this.y = y
        this.radius = radius
        this.velocity = velocity
        this.color = color
    }

    draw() {
        cSho.fillStyle = this.color
        cSho.beginPath()
        cSho.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        cSho.fill()
    }

    update() {
        this.x = this.x + this.velocity.x * 2
        this.y = this.y + this.velocity.y * 2
        this.draw()
    }
}
class Particle {
    constructor(x, y, radius, velocity, color) {
        this.x = x
        this.y = y
        this.radius = radius
        this.velocity = velocity
        this.color = color
        this.direct = 1
    }

    draw() {
        cSho.fillStyle = this.color
        cSho.beginPath()
        cSho.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        cSho.fill()
    }

    update() {
        this.x = this.x + this.velocity.x * 2 * this.direct
        this.y = this.y + this.velocity.y * 2 * this.direct
        this.draw()
    }
}

shooterBoard.addEventListener('mousedown', mouse => {
    let angle = Math.atan2(mouse.clientY - shooterBoard.height/2, mouse.clientX - shooterBoard.width/2)
    let velocity = {
        x: Math.cos(angle) * 1,
        y: Math.sin(angle) * 1
    }
    projectiles.push(new Projectile(shooterBoard.width / 2 + velocity.x * 50, shooterBoard.height / 2 + velocity.y * 50, 10, velocity, "white"))
})

const loop = () => {
    shoLoop = requestAnimationFrame(loop);
    if (shOver === true) {
        return;
    } else {
        looping = true;
        cSho.fillStyle =  'rgba(20,0,0,0.25)'
        cSho.fillRect(0, 0, shooterBoard.width, shooterBoard.height);
        //creates a 'fade' effect everytime this loop is called
        document.getElementById('shooter-score').innerHTML = `SCORE: ${score}`
        particles.forEach((part, index) => {
            part.update();
            if (part.x - part.radius <= 0 || part.x + part.radius >= shooterBoard.width || part.y - part.radius <= 0 || part.y + part.radius >= shooterBoard.height) {
                particles.splice(index, 1);
            }
            let partDist = Math.hypot(shooterBoard.width/2 - part.x, shooterBoard.height/2 - part.y)
            if (partDist - 30 - part.radius < 1) {
                part.direct = part.direct * -1;
      }
        })
        projectiles.forEach((pro, index) => {
            pro.update();
            //removes projectiles when it goes off screen
            if (pro.x - pro.radius <= 0 || pro.x + pro.radius >= shooterBoard.width || pro.y - pro.radius <= 0 || pro.y + pro.radius >= shooterBoard.height) {
                projectiles.splice(index, 1);
                console.log(projectiles)
            }
        })
        enemies.forEach((enem, index) => {
            enem.update();
            let dist = Math.hypot(shooterBoard.width/2 - enem.x, shooterBoard.height/2 - enem.y)
            //gameover on player contact
            if (dist - 15 - enem.radius < 1) {
                shoOver()
            }
            projectiles.forEach((proj, pindex) => {
                let space = Math.hypot(proj.x - enem.x, proj.y - enem.y)
                if (space - enem.radius - proj.radius < 0.3) {
                    score ++
                    for (let i = 0; i < Math.floor(enem.radius/3.123); i++) {
                        particles.push(new Particle(proj.x, proj.y, 1.5, {x: Math.random() * 3 - 1.5, y: Math.random() * 3 - 1.5}, enem.color))
                    } 
                    setTimeout(()=> {
                        enemies.splice(index,1)
                        projectiles.splice(pindex, 1)
                    })
                }
            })

        })
    }
}

const unloop = () => {
    cancelAnimationFrame(shoLoop)
}

//function for spawning enemies
setInterval(()=> {
    let ranRad = Math.random() * 35 + 30
    let randomX;
    let randomY;
    if (Math.random() < 0.5) {
        randomX = Math.random() < 0.5 ? 0 - ranRad : shooterBoard.width + ranRad;
        randomY = Math.random() * shooterBoard.height;
    } else {
      randomX = Math.random() * shooterBoard.width;
      randomY = Math.random() < 0.5 ? 0 - ranRad : shooterBoard.height + ranRad;
    }

    let angle = Math.atan2(shooterBoard.height/2  - randomY, shooterBoard.width/2 - randomX)
    let velocity = {
        x: Math.cos(angle) * .75,
        y: Math.sin(angle) * .75
    }
    if (active !== 'shooter') {
        if (shOver === false) {
            shoOver();
        } else {
            return
        }
    }

    if (active === 'shooter' && shOver === false) {
        enemies.push(new Enemy(randomX, randomY, ranRad, velocity, randColNoA()))
    } else {
        return
    }   


}, spawnTimer)





