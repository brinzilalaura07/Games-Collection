'use strict';

//Selecting elements 
const player0El = document.querySelector('.player--0');
const player1El = document.querySelector('.player--1');
const score0El = document.querySelector('#score--0'); // selected by id
const score1El = document.getElementById('score--1');
const current0El = document.querySelector('#current--0');
const current1El = document.getElementById('current--1');
const diceEl = document.querySelector('.dice');




const btnNew = document.querySelector('.btn--new');
const btnRoll = document.querySelector('.btn--roll');
const btnHold = document.querySelector('.btn--hold');

let scores, currentScore, activePlayer, playing; //varibles basicaly live right here 

//Starting condition
const init = function () {
    //reassign varibles 
    scores = [0, 0];
    currentScore = 0;
    activePlayer = 0;
    playing = true;
    console.log('should play');

    score0El.textContent = 0;
    score1El.textContent = 0;
    current0El.textContent = 0;
    current1El.textContent = 0;


    diceEl.classList.add('hidden');
    player0El.classList.remove('player--winner');
    player1El.classList.remove('player--winner');
    player0El.classList.add('player--active');
    player1El.classList.remove('player--active');
};

init();


const switchPlayer = function () {
    document.getElementById(`current--${activePlayer}`).textContent = 0;
    currentScore = 0;
    activePlayer = activePlayer === 0 ? 1 : 0; // if active player is o then it will be 1 else ..
    player0El.classList.toggle('player--active'); //add or remove if it's there or not 
    player0El.classList.toggle('player--active');
}

btnRoll.addEventListener('click', function () {
    if (playing) {
        //.Generating a random diceRoll
        const dice = Math.trunc(Math.random() * 6) + 1;

        //2. Display the dice
        diceEl.classList.remove('hidden');
        diceEl.src = `dice-${dice}.png`;

        //3.Check for rolled 1: if true, switch to next player
        if (dice !== 1) {
            // Add the dice to the curent score
            currentScore += dice;
            //select the score dinamicaly based on wich is the active player right now
            document.getElementById(`current--${activePlayer}`).textContent = currentScore;
            //current0El.textContent = currentScore; // change latter
        } else {
            //Switch to next player
            switchPlayer();
        }
    }
});

btnHold.addEventListener('click', function () {
    if (playing) {
        //1. Add current score to active player's score
        scores[activePlayer] += currentScore;

        // score[1] = score[1] + currentScore;
        document.getElementById(`score--${activePlayer}`).textContent = scores[activePlayer];


        //2. check if player's score is >=100
        //Finidh the game
        if (scores[activePlayer] >= 20) {
            playing = false;

            document.querySelector(`.player--${activePlayer}`).classList.add('player--winner');
            document.querySelector(`.player--${activePlayer}`).classList.remove('player--active');
            diceEl.classList.remove('hidden');
        }
        //3. Switch to the next player 
        switchPlayer();
    }
})


btnNew.addEventListener('click', init); //we don't call the function it just define, JavaScript will call it 