const colors = ["red", "blue", "green", "yellow", "purple", "orange", "pink", "brown"];
let cards = [];

function createCards() {
    const memoryGame = document.querySelector('.memory-game');
    colors.forEach(color => {
        for (let i = 0; i < 2; i++) {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.color = color;
            card.textContent = '?';
            card.addEventListener('click', flipCard);
            cards.push(card);
            memoryGame.appendChild(card);
        }
    });
}

function shuffleCards() {
    cards.forEach(card => {
        const randomPos = Math.floor(Math.random() * cards.length);
        card.style.order = randomPos;
    });
}

let flippedCards = [];
let hasFlippedCard = false;
let lockBoard = false;

function flipCard() {
    if (lockBoard || this.classList.contains('matched')) return;
    if (this === flippedCards[0]) return;
    
    this.style.backgroundColor = this.dataset.color; // Reveal color when clicked
    this.textContent = ''; // Hide the question mark

    if (!hasFlippedCard) {
        // First card flipped
        hasFlippedCard = true;
        flippedCards[0] = this;
        return;
    }

    // Second card flipped
    flippedCards[1] = this;
    checkForMatch();
}


function checkForMatch() {
    let isMatch = flippedCards[0].dataset.color === flippedCards[1].dataset.color;
    isMatch ? disableCards() : unflipCards();
}

// Your existing JavaScript code here

function checkForWin() {
    if (document.querySelectorAll('.card.matched').length === cards.length) {
        const modal = document.getElementById('myModal');
        modal.style.display = 'block';

        const tryAgainButton = document.getElementById('try-again');
        tryAgainButton.addEventListener('click', function() {
            modal.style.display = 'none'; // Hide the modal
            resetGame(); // Reset the game
        });

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
    }
}



function disableCards() {
    flippedCards.forEach(card => {
        card.removeEventListener('click', flipCard);
        card.classList.add('matched');
    });
    checkForWin();
    resetBoard();
}

function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        flippedCards.forEach(card => {
            card.style.backgroundColor = ''; // Reset background color
            card.textContent = '?';
        });
        resetBoard();
    }, 1000);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [flippedCards[0], flippedCards[1]] = [null, null];
}

function resetGame() {
    cards.forEach(card => {
        card.style.backgroundColor = '';
        card.textContent = '?';
        card.classList.remove('matched');
        card.addEventListener('click', flipCard);
    });
    shuffleCards();
    resetBoard();
}

const resetButton = document.getElementById('reset-button');
resetButton.addEventListener('click', resetGame);

(function init() {
    createCards();
    shuffleCards();
})();
