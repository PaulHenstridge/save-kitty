const safety = document.querySelector('#safety')
const fire = document.querySelector('#fire')
const kitty = document.querySelector('#kitty')

const wordDiv = document.querySelector('.word-div')
const wrongGuesses = document.querySelector('.wrong-guesses')

const guess = document.querySelector('#guess')

const portalBtn = document.querySelector('.portal-btn')

const start = document.querySelector('#start')

const msgWindow = document.querySelector('.msg-border')

let ansArray = []
let blanksArray = []
let wrongArray = []
let alreadyGuessed = []
let lettersRemaining  //set to length of word.  when indexArray returned, subtract the length form this

const kittyParams = {
    top: 48.5,
    speed: 5
}

start.addEventListener('click', () => {
    msgWindow.classList.remove('active')
    getNewWord()
    guess.focus()
    guess.select()
})

guess.addEventListener('keyup', e => {
    guess.value = guess.value.toUpperCase()
    checkGuess(e.key)
    setTimeout(() => guess.value = '', 1000)

    // if current guess is in the correct word array
    // remove it form there, and reveal it on the board
})

portalBtn.addEventListener('click', () => {
    if (kittyParams.top > 70 && kittyParams.top < 80) {
        kittyParams.top -= 40
        kitty.style.top = kittyParams.top + '%'
    }
})


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
        ansArray.forEach(let => {
            blanksArray.push('_')
        })
        wordDiv.innerText = blanksArray.join(' ')
        kittyParams.speed = 50 / blanksArray.length
        lettersRemaining = answer.length
    }
}

function checkGuess(guess) {
    if (ansArray.includes(guess) && !alreadyGuessed.includes(guess)) {

        alreadyGuessed.push(guess)

        let idxArray = ansArray.reduce((tot, curVal, idx) => {
            if (curVal === guess) tot.push(idx)
            return tot
        }, [])  // <-- initial value set as empty array --- nice ;-)

        idxArray.forEach(i => blanksArray.splice(i, 1, guess.toUpperCase()))

        wordDiv.innerText = blanksArray.join(' ')

        kittyParams.top -= kittyParams.speed // 50/ ans.len
        console.log('top:', kittyParams.top)
        kitty.style.top = kittyParams.top + '%'
        // if kitty top < 10 => saved kitty!
        if (kittyParams.top < 5) {
            msgWindow.classList.add('active')
            msgWindow.firstElementChild.innerHTML = `
            <h1>You saved Kitty!!</h1>
            <button class="restart">Restart</button>
            `

            document.querySelector('.restart').addEventListener('click', () => {
                kitty.style.top = '48.5%'
                kittyParams.top = '48.5'
                msgWindow.classList.remove('active')
                getNewWord()
                guess.focus()
                guess.select()
            })
        }

        lettersRemaining -= idxArray.length
        if (lettersRemaining <= 0) {
            msgWindow.classList.add('active')
            msgWindow.firstElementChild.innerText = 'Boom! you got it, but the Kitty is still in danger!! Click start to keep playing.'
        }

    } else {

        wrongArray.push(guess.toUpperCase())
        wrongGuesses.innerText = wrongArray.join(' ')
        kittyParams.top += kittyParams.speed // 50/ ans.len
        console.log('top:', kittyParams.top)
        kitty.style.top = kittyParams.top + '%'
        //if kitty top > 90  => dead kitty :-( 
        if (kittyParams.top > 95) {
            msgWindow.classList.add('active')
            msgWindow.firstElementChild.innerText = 'Dead kitty :-('
        }
    }
}

