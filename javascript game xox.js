let playerTurn = "x";
let moves = 0;
let isGameOver = false;
let gameMode = "player";
let scoreX = 0;
let scoreO = 0;

function togglePlayer2Input() {
    const gameMode = document.getElementById("gameMode").value;
    const player2Input = document.getElementById("player2-input");

    if (gameMode === "player") {
        player2Input.style.display = "block";
    } else {
        player2Input.style.display = "none";
    }
}

function resetScore() {
    scoreX = 0;
    scoreO = 0;
    updateScoreboard();
}

function updateScoreboard() {
    const playerName1 = document.getElementById("playerName1").value || "Player 1";
    const playerName2 = gameMode === "bot" ? "Bot" : document.getElementById("playerName2").value || "Player 2";
    document.getElementById("score").innerText = `Player X (${playerName1}): ${scoreX} | Player O (${playerName2}): ${scoreO}`;
}

function startGame() {
    const playerName1 = document.getElementById("playerName1").value;
    const playerName2 = document.getElementById("playerName2").value || "the bot";
    gameMode = document.getElementById("gameMode").value;

    if (playerName1.trim() === "") {
        alert("Please enter Player 1's name.");
        return;
    }

    if (gameMode === "player" && playerName2.trim() === "") {
        alert("Please enter Player 2's name.");
        return;
    }

    const welcomeMessage = `Welcome, ${playerName1}! You are playing ${gameMode === "bot" ? "against the bot." : `against ${playerName2}.`}`;
    document.getElementById("welcomeMessage").innerText = welcomeMessage;
    updateScoreboard();
    document.getElementById("start-screen").style.display = "none";
    document.getElementById("container").style.display = "block";
}

function play(box) {
    if (box.dataset.player !== "none" || isGameOver) return;

    // Player's turn
    box.innerHTML = playerTurn;
    box.dataset.player = playerTurn;
    moves++;

    if (checkWin()) {
        updateScore(playerTurn); // Update the score when someone wins
        return; // Message already shown in checkWin
    } else if (moves === 9) {
        showGameOverMessage("It's a draw!");
        return;
    }

    // Bot play after Player X's turn
    if (gameMode === "bot" && playerTurn === "x" && !isGameOver) {
        playerTurn = "o"; // Switch to bot's turn
        setTimeout(botPlay, 500); // Add delay for bot play
    } else if (gameMode === "player") {
        playerTurn = playerTurn === "x" ? "o" : "x"; // Switch between players in player vs player mode
    }
}

function botPlay() {
    const availableMoves = [...document.querySelectorAll("span[data-player='none']")];
    if (availableMoves.length === 0 || isGameOver) return;

    const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    randomMove.innerHTML = playerTurn;
    randomMove.dataset.player = playerTurn;
    moves++;

    if (checkWin()) {
        updateScore(playerTurn); // Update the score when bot wins
        showGameOverMessage(`Player ${playerTurn.toUpperCase()} wins!`);
        return;
    } else if (moves === 9) {
        showGameOverMessage("It's a draw!");
        return;
    }

    playerTurn = "x"; // Switch back to Player X
}

function checkWin() {
    const winningCombinations = [
        ["box1", "box2", "box3"],
        ["box4", "box5", "box6"],
        ["box7", "box8", "box9"],
        ["box1", "box4", "box7"],
        ["box2", "box5", "box8"],
        ["box3", "box6", "box9"],
        ["box1", "box5", "box9"],
        ["box3", "box5", "box7"],
    ];

    for (const combination of winningCombinations) {
        const [a, b, c] = combination.map(id => document.getElementById(id).querySelector('span').dataset.player);
        if (a === b && b === c && a !== "none") {
            showGameOverMessage(`Player ${a.toUpperCase()} wins!`);
            isGameOver = true;
            return true;
        }
    }

    return false;
}

function showGameOverMessage(message) {
    document.getElementById("gameOverMessage").innerText = message;
    document.getElementById("gameOverNotification").style.display = "flex"; // Show notification
}

function updateScore(winner) {
    if (winner === "x") {
        scoreX++;
    } else {
        scoreO++;
    }
    updateScoreboard();
}

function resetGame() {
    document.querySelectorAll(".box span").forEach(box => {
        box.dataset.player = "none";
        box.innerHTML = "&nbsp;";
    });
    playerTurn = "x";
    moves = 0;
    isGameOver = false;
    document.getElementById("gameOverNotification").style.display = "none"; // Hide notification
}

function resetToStart() {
    resetGame();
    document.getElementById("start-screen").style.display = "block";
    document.getElementById("container").style.display = "none";
    resetScore();
}
