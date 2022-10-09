const body = document.querySelector('body')

const kitty = document.querySelector('#kitty')
const timer = document.querySelector('.timer-window')

const levels = document.querySelector('.levels')
// const easy = document.querySelector('#easy')
// const medium = document.querySelector('#medium')
// const hard = document.querySelector('#hard')


const wordDiv = document.querySelector('.word-div')
const wrongGuesses = document.querySelector('.wrong-guesses')

const guessInput = document.querySelector('#guess')

const portalCount = document.querySelector('.portal-count')
const portalBtn = document.querySelector('.portal-btn')
const start = document.querySelector('#start')

const msgWindow = document.querySelector('.msg-border')

const powerBar = document.querySelector('.powerup-level')
const powerUpBtn = document.querySelector('.powerup-btn')
const powerUpContainer = document.querySelector('.powerup-bar')
const powerUpMssg = document.querySelector('.powerup-mssg')
const powerUpBox = document.querySelector('.powerup-info-box')

const hintPeek = document.querySelector('.hint')

const heaven = document.querySelector('.heaven')
const hell = document.querySelector('.hell')

let ansArray = []
let blanksArray = []
let wrongArray = []
let alreadyGuessed = []
let lettersRemaining  //set to length of word.  when indexArray returned, subtract the length form this
let powerUp = 0
let clock

const kittyParams = {
    top: 48.5,
    speed: 5
}
//difficulty level settings: default to easy setting
let gameDuration = 90
let numberOfPortals = 2
let minWordLength = 4
let maxWordLength = 6
// speed (dist covered)for right and wrong answers
// powerup boost


// listeners

levels.addEventListener('click', e => {
    switch (e.path[0].id) {
        case 'easy':
            console.log(e.path[0].id)
            gameDuration = 90
            numberOfPortals = 3
            minWordLength = 4
            maxWordLength = 6
            break
        case 'medium':
            console.log(e.path[0].id)
            gameDuration = 60
            numberOfPortals = 2
            minWordLength = 6
            maxWordLength = 8
            break
        case 'hard':
            console.log(e.path[0].id)
            gameDuration = 45
            numberOfPortals = 1
            minWordLength = 8
            maxWordLength = 100
    }
})

start.addEventListener('click', () => {
    startGame()
})

// keep input selected if player clicks away
body.addEventListener('click', () => {
    guessInput.select()
})

guessInput.addEventListener('keyup', e => {
    guess.value = guess.value.toUpperCase()
    checkGuess(e.key)
    setTimeout(() => guess.value = '', 1200)

    // if current guess is in the correct word array
    // remove it form there, and reveal it on the board
})

portalBtn.addEventListener('click', () => {
    if (kittyParams.top > 70 && kittyParams.top < 80 && numberOfPortals > 0) {
        kittyParams.top -= 40
        kitty.style.top = kittyParams.top + '%'
        numberOfPortals--
        portalCount.innerText = numberOfPortals
    }
    guessInput.focus()
})

powerUpBtn.addEventListener('click', () => {
    powerUpContainer.classList.remove('active')
    powerUpBtn.classList.remove('active')
    powerUp = 0
    powerBar.style.height = '5%'
    choosePowerUp()
})


// functions

function startGame() {
    makeFire()
    makeClouds()
    msgWindow.classList.remove('active')
    portalCount.innerText = numberOfPortals
    getNewWord()
    guessInput.select()
    startTimer(gameDuration)
}



function getIndex(arr) {
    return Math.floor(Math.random() * arr.length)
}

function getNewWord() {
    //  resets
    ansArray = []
    blanksArray = []
    wrongArray = []
    alreadyGuessed = []
    lettersRemaining = ''
    wordDiv.innerText = ''
    wrongGuesses.innerText = ''

    let answer = wordies[getIndex(wordies)]
    console.log(answer)
    if (answer.length < minWordLength || answer.length > maxWordLength) {
        getNewWord()
    } else {
        ansArray = answer.split('')
        console.log(ansArray, ansArray.length)
        ansArray.forEach(letter => {
            blanksArray.push('_')
        })
        wordDiv.innerText = blanksArray.join(' ')
        // kittyParams.speed = 50 / blanksArray.length
        lettersRemaining = answer.length
    }
}

function checkGuess(guess) {
    if (ansArray.includes(guess) && !alreadyGuessed.includes(guess)) {
        // correct guess

        alreadyGuessed.push(guess)
        // make an array with the indexes of all matching letters.
        let idxArray = ansArray.reduce((tot, curVal, idx) => {
            if (curVal === guess) tot.push(idx)
            return tot
        }, [])  // <-- initial value set as empty array --- nice ;-)

        // add guessed letter at those index points on blanks array
        idxArray.forEach(i => blanksArray.splice(i, 1, guess.toUpperCase()))
        wordDiv.innerText = blanksArray.join(' ')

        // move kitty towards safety and check for win condition
        kittyParams.top -= kittyParams.speed // 50/ ans.len
        console.log('top:', kittyParams.top)
        kitty.style.top = kittyParams.top + '%'

        if (kittyParams.top < 5) {
            clearInterval(clock)
            msgWindow.classList.add('active')
            msgWindow.firstElementChild.innerHTML = `
                <h1>You saved Kitty!!</h1>
                <button class="restart">Restart</button>
            `
            // display final scores - time, levels?
            document.querySelector('.restart').addEventListener('click', () => {
                kitty.style.top = '48.5%'
                kittyParams.top = 48.5
                startGame()
            })
        }

        lettersRemaining -= idxArray.length
        if (lettersRemaining <= 0) {  // and kitty isnt already saved
            clearInterval(clock)
            msgWindow.classList.add('active')
            msgWindow.firstElementChild.innerHTML = `
            <h1>Boom!!!</h1>
            <h2>Correct Answer, but kitty isn't safe yet...</h2>
            <h4>click here to continue</h4>
            <button class="restart continue">Continue</button>
        `
            document.querySelector('.continue').addEventListener('click', () => {
                startGame()
            })
            // display final scores - time, levels?
        }

        powerUp += 20
        console.log('powerUp:', powerUp)
        powerBar.style.height = `${powerUp}%`
        if (powerUp >= 100) {
            powerUpBtn.classList.add('active')
            powerUpContainer.classList.add('active')
        }


    } else {
        // wrong guess

        if (powerUp > 10) {
            powerUp -= 5
            powerBar.style.height = `${powerUp}%`
        }

        // move kitty and check for lose conditions
        wrongArray.push(guess.toUpperCase())
        wrongGuesses.innerText = wrongArray.join(' ')
        kittyParams.top += kittyParams.speed // 50/ ans.len
        console.log('top:', kittyParams.top)
        kitty.style.top = kittyParams.top + '%'
        //if kitty top > 95  => dead kitty :-( 
        if (kittyParams.top > 95) {
            clearInterval(clock)
            msgWindow.classList.add('active')
            msgWindow.firstElementChild.innerHTML = `
            <h1>You killed Kitty!!</h1>
            <h5> the word was: ${ansArray.join('').toUpperCase()}</h5>
            <h5> but that doesn't really matter anymore, does it? </h5>
            <button class="restart">Restart</button>
            `
            document.querySelector('.restart').addEventListener('click', () => {
                kitty.style.top = '48.5%' //should also use transposeY -(half kitty height)?
                kittyParams.top = 48.5
                startGame()
            })
        }
    }
}



let roundTime = 0
function startTimer(time) {
    roundTime = time
    timer.innerText = roundTime
    clock = setInterval(() => {
        roundTime -= 1
        timer.innerText = roundTime
        if (roundTime <= 0) {
            clearInterval(clock)
            // Time up you lose etc

            kitty.style.top = '100%'
            setTimeout(() => {
                msgWindow.classList.add('active')
                msgWindow.firstElementChild.innerHTML = `
                <h1>You ran out of time!!</h1>
                <h2>Kitty Fried!!!</h2>
                <h5> the word was: ${ansArray.join('').toUpperCase()}</h5>
                <h4>click below to try again</h4>
                <button class="restart">Restart</button>
                `
                document.querySelector('.restart').addEventListener('click', () => {
                    kitty.style.top = '48.5%'
                    kittyParams.top = 48.5
                    startGame()
                })
            }, 1500)
        }
    }, 1000)
}




function choosePowerUp() {
    switch (Math.floor(Math.random() * 4)) {
        case 0: addTen()
            showMessage('10 seconds added to timer!')
            break
        case 1: bigPussy()
            showMessage('Uh-oh, its Big Pussy!')
            break
        case 2: revealLetter()
            showMessage('heres a hint...')
            break
        case 3: addPortal()
            showMessage('extra portal added!')
    }
}

function addTen() {
    roundTime += 11
}

function bigPussy() {
    kitty.classList.add('big-pussy')
    setTimeout(() => {
        kitty.classList.remove('big-pussy')
    }, 1000 * roundTime / 4)
}

function revealLetter() {
    let hint = ansArray[getIndex(ansArray)]
    if (!alreadyGuessed.includes(hint)) {
        // reveal the letter
        hintPeek.innerText = hint
        hintPeek.classList.add('active')
        setTimeout(() => { hintPeek.classList.remove('active') }, 2000)
        console.log({ hint })
    } else {
        console.log('alredy guessed')
        revealLetter()
    }
}

function addPortal() {
    numberOfPortals++
    portalCount.innerText = numberOfPortals
}

function showMessage(message) {
    powerUpMssg.innerText = message
    powerUpBox.classList.add('active')
    setTimeout(() => {
        powerUpMssg.classList.add('active')
    }, 300)
    setTimeout(() => {
        powerUpMssg.classList.remove('active')
        setTimeout(() => powerUpBox.classList.remove('active'), 300)
    }, 3000)
}


function makeFire() {     // set them off at diferent times so they flicker more randomly.  setTimeout?
    let left = 1
    for (let i = 0; i < 5; i++) {
        let flame = document.createElement('div')
        flame.innerHTML = `          
            <div class="flame-wrapper">
                <div class="flame red"></div>
                <div class="flame orange"></div>
                <div class="flame gold"></div>
                <div class="flame white"></div>
                <div class="base blue"></div>
                <div class="base black"></div>
            </div>    
        `    // set off more with random times on their setTimeouts

        flame.classList.add('fire')
        flame.style.left = `${left}%`
        hell.appendChild(flame)
        left += 20
    }
}

function makeClouds() {
    // let rand = (Math.floor(Math.random() *10) - 1)
    let cloud = document.createElement('div')
    cloud.innerHTML = `
    <div class="cloud-wrapper">
        <div class="cloud middle"></div>
        <div class="cloud bump1"></div>
        <div class="cloud bump2"></div>
        <div class="cloud bump3"></div>
    </div>`
    cloud.classList.add('clouds')
    cloud.style.left = '-4%'
    cloud.style.top = '70%'
    heaven.appendChild(cloud)

}

// TODO - make text smaller for mobile.
//         add time for each correct guess
//         make medium words easy and short and long both hard

//   give 5 secs to take powerup or lose it.
// aim of game is to save kitty in fastest time.
// or, set time per round, counts down. must complete within time.  powerup adds time

/*
powerbar move left and make bigger
set number of portals

set difficulty levels
    params: time
             word length
             portals
             speed ie dist per guess

random choosePowerUp func

make big small etc classes for cloud and fire


*/