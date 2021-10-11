const safety = document.querySelector('#safety')
const fire = document.querySelector('#fire')
const kitty = document.querySelector('#kitty')

const wordDiv = document.querySelector('.word-div')
const wrongGuesses = document.querySelector('.wrong-guesses')

const guess = document.querySelector('#guess')

const start = document.querySelector('#start')

let ansArray = []
let blanksArray = []
let wrongArray = []

const kittyParams = {
    top: 48.5,
    speed: 5
}

start.addEventListener('click', () => {
    getNewWord()
})

safety.addEventListener('click', () => {
    kittyParams.top -= 6
    kitty.style.top = kittyParams.top + '%'
})

fire.addEventListener('click', () => {
    kittyParams.top += kittyParams.speed // 50/ ans.len
    kitty.style.top = kittyParams.top + '%'
})

guess.addEventListener('keyup', e => {
    checkGuess(e.key)
    setTimeout(() => guess.value = '', 500)

    // if current guess is in the correct word array
    // remove it form there, and reveal it on the board
})




function getIndex(arr) {
    return Math.floor(Math.random() * arr.length)
}

function getNewWord() {
    wordDiv.innerText = ''
    blanksArray = []
    wrongGuesses.innerText = ''
    wrongArray = []
    let answer = wordies[getIndex(wordies)]
    console.log(answer)
    if (answer.length < 4) {
        getNewWord()
    } else {
        ansArray = answer.split('')
        console.log(ansArray, ansArray.length)
        ansArray.forEach(let => {
            blanksArray.push('_')
        })
        wordDiv.innerText = blanksArray.join(' ')
        kittyParams.speed = 50 / blanksArray.length
    }
}

function checkGuess(guess) {
    if (ansArray.includes(guess)) {
        let idxArray = ansArray.reduce((tot, curVal, idx) => {
            if (curVal === guess) tot.push(idx)
            return tot
        }, [])  // initial value set as empty array --- nice ;-)


        idxArray.forEach(i => blanksArray.splice(i, 1, guess.toUpperCase()))

        // remove guessed letter form correct answer array
        // when array is empty game over

        wordDiv.innerText = blanksArray.join(' ')
        kittyParams.top -= kittyParams.speed // 50/ ans.len
        kitty.style.top = kittyParams.top + '%'

    } else {

        wrongArray.push(guess.toUpperCase())
        wrongGuesses.innerText = wrongArray.join(' ')
        kittyParams.top += kittyParams.speed // 50/ ans.len
        console.log(kittyParams.top)
        kitty.style.top = kittyParams.top + '%'
    }
}

