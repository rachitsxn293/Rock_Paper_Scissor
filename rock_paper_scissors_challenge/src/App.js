import React, { useState, useEffect } from 'react';
import './App.css';

// Define the  choices
const choices = ['rock', 'paper', 'scissors'];

// Reference local images (place rock.jpg, paper.jpg, scissors.jpg in public/images/)
const images = {
  rock: '/images/rock.jpg',
  paper: '/images/paper.jpg',
  scissors: '/images/scissors.jpg',
};

// Determine the winner 
function determineWinner(move1, move2) {
  if (move1 === move2) return 'draw';
  if (
    (move1 === 'rock' && move2 === 'scissors') ||
    (move1 === 'paper' && move2 === 'rock') ||
    (move1 === 'scissors' && move2 === 'paper')
  ) {
    return 'player1';
  }
  return 'player2';
}

function App() {
  const [player1Name, Player1State] = useState('');
  const [player2Name, Player2State] = useState('');
  const [player1Move, Player1Move] = useState('');
  const [player2Move, Player2Move] = useState('');
  const [score, setScore] = useState({ player1: 0, player2: 0 });
  const [message, setMessage] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [lastSavedGame, setLastSavedGame] = useState(null);

  // Log the score whenever it changes 
  useEffect(() => {}, [score]);

  const startGame = () => {
    if (player1Name && player2Name) {
      setGameStarted(true);
      setMessage(`Game Begin: ${player1Name} vs ${player2Name}`);
    } else {
      alert('Please enter names for both players.');
    }
  };

  const handlePlayerMove = (player, move) => {
    if (player === 'player1') {
      Player1Move(move);
    } else {
      Player2Move(move);
    }
  };

  const playTurn = () => {
    let finalPlayer2Move = player2Move;
    // If player 2 is set to "computer", randomly select a move
    if (player2Name.toLowerCase() === 'computer') {
      finalPlayer2Move = choices[Math.floor(Math.random() * choices.length)];
      Player2Move(finalPlayer2Move);
    }

    if (!player1Move || !finalPlayer2Move) {
      alert('Both players need to choose a move!');
      return;
    }

    const winner = determineWinner(player1Move, finalPlayer2Move);
    let turnMessage = `${player1Name} chose ${player1Move}. ${player2Name} chose ${finalPlayer2Move}. `;

    if (winner === 'draw') {
      turnMessage += "It's a draw!";
    } else if (winner === 'player1') {
      turnMessage += `${player1Name} wins the turn!`;
      setScore(prev => {
        const newScore = { ...prev, player1: prev.player1 + 1 };
        return newScore;
      });
    } else {
      turnMessage += `${player2Name} wins the turn!`;
      setScore(prev => {
        const newScore = { ...prev, player2: prev.player2 + 1 };
        return newScore;
      });
    }

    setMessage(turnMessage);
    Player1Move('');
    Player2Move('');
  };

  // Fetch the last saved game
  const LastGameRun = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/last_game_route');
      const result = await response.json();
      if (response.ok) {
        setLastSavedGame(result.lastGame);
      } else {
        alert(result.message || 'No saved game found.');
      }
    } catch (error) {
      alert("Error fetching last game.");
    }
  };

  // Save the current game 
  const saveGame = async () => {
    const gameData = {
      players: { player1: player1Name, player2: player2Name },
      score,
      lastMessage: message,
    };

    try {
      const response = await fetch('http://127.0.0.1:5000/save_game_route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gameData),
      });
      const result = await response.json();
      if (response.ok) {
        alert("Game saved successfully!");
        LastGameRun();
      } else {
        alert("Error saving game: " + result.error);
      }
    } catch (error) {
      alert("Error saving game.");
    }
  };

  return (
    <div className="container">
      <div className="card">
        {!gameStarted ? (
          <div>
            <h2 className="title">Enter Player Names</h2>
            <div className="input-group">
              <label>
                Player 1:
                <input
                  type="text"
                  value={player1Name}
                  onChange={event => Player1State(event.target.value)}
                />
              </label>
            </div>
            <div className="input-group">
              <label>
                Player 2 (or type "Computer"):
                <input
                  type="text"
                  value={player2Name}
                  onChange={event => Player2State(event.target.value)}
                />
              </label>
            </div>
            <div className="center-content">
              <button onClick={startGame}>Start Game</button>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="title">Rock, Paper, Scissors</h2>
            <div>
              <strong>{player1Name}</strong>'s turn:
              <div className="center-content">
                {choices.map(c => (
                  <button
                    key={c}
                    onClick={() => handlePlayerMove('player1', c)}
                    className="choice-btn"
                  >
                    <img src={images[c]} alt={c} className="choice-image" />
                  </button>
                ))}
              </div>
            </div>
            {player2Name.toLowerCase() !== 'computer' && (
              <div style={{ marginTop: '20px' }}>
                <strong>{player2Name}</strong>'s turn:
                <div className="center-content">
                  {choices.map(c => (
                    <button
                      key={c}
                      onClick={() => handlePlayerMove('player2', c)}
                      className="choice-btn"
                    >
                      <img src={images[c]} alt={c} className="choice-image" />
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="turn-content" style={{ marginTop: '20px' }}>
              <button onClick={playTurn}>Play Turn</button>
            </div>
            <div className="message">
              <p>{message}</p>
              <div className="score-board">
                Score: {player1Name}: {score.player1} - {player2Name}: {score.player2}
              </div>
            </div>
            <div className="center-content">
              <button onClick={saveGame} className="save-btn">Save Game</button>
            </div>
            {lastSavedGame && (
              <div className="last-game">
                <h3>Last Saved Game</h3>
                <p>
                  <strong>Players:</strong> {lastSavedGame.players.player1} vs {lastSavedGame.players.player2}
                </p>
                <p>
                  <strong>Score:</strong> {lastSavedGame.score.player1} - {lastSavedGame.score.player2}
                </p>
                <p>
                  <strong>Message:</strong> {lastSavedGame.lastMessage}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
