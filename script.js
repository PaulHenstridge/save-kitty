const body = document.querySelector('body')
const safety = document.querySelector('#safety')
const fire = document.querySelector('#fire')
const kitty = document.querySelector('#kitty')

const timer = document.querySelector('.timer-window')

const wordDiv = document.querySelector('.word-div')
const wrongGuesses = document.querySelector('.wrong-guesses')

const guessInput = document.querySelector('#guess')

const portalBtn = document.querySelector('.portal-btn')

const start = document.querySelector('#start')

const msgWindow = document.querySelector('.msg-border')
const powerBar = document.querySelector('.powerup-level')
const powerUpBtn = document.querySelector('.powerup-btn')
const powerUpContainer = document.querySelector('.powerup-bar')

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

// listeners

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
    if (kittyParams.top > 70 && kittyParams.top < 80) {
        kittyParams.top -= 40
        kitty.style.top = kittyParams.top + '%'
    }
    guessInput.focus()
})

powerUpBtn.addEventListener('click', () => {
    powerUpContainer.classList.remove('active')
    powerUpBtn.classList.remove('active')
    powerUp = 0
    powerBar.style.height = '5%'
    addTen()
    // choosePowerUp()
})


// functions

function startGame() {
    msgWindow.classList.remove('active')
    getNewWord()
    guessInput.select()
    startTimer(15)
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
    if (answer.length < 4) {
        getNewWord()
    } else {
        ansArray = answer.split('')
        console.log(ansArray, ansArray.length)
        ansArray.forEach(letter => {
            blanksArray.push('_')
        })
        wordDiv.innerText = blanksArray.join(' ')
        kittyParams.speed = 50 / blanksArray.length
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
        if (lettersRemaining <= 0) {  // and kitty isnt alreasdy saved
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
            powerUp -= 10
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
            <button class="restart">Restart</button>
            `
            document.querySelector('.restart').addEventListener('click', () => {
                kitty.style.top = '48.5%'
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
    // +1 portal, giant kitty, reveal one letter, more time, ...
}

function addTen() {
    roundTime += 11
}
// add a game timer.  give 5 secs to take powerup or lose it.
// aim of game is to save kitty in fastest time.
// or, set time per round, counts down. must complete within time.  powerup adds time