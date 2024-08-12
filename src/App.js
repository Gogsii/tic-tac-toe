import React, { useState } from "react";
import Square from "./components/square";

export default function Game() {
  //lifting state up from Square to Board. to Game This keeps the child components in sync with each other and with their parent.
  const [history, setHistory] = useState([Array(9).fill(null)]); //creates an array with nine elements and sets each of them to null
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(newSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), newSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}/>
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

//------------------------------------------------------------//

function Board({ xIsNext, squares, onPlay }) {
  // //lifting state up from Square to Board. to Game This keeps the child components in sync with each other and with their parent.
  // const [xIsNext, setXIsNext] = useState(true);
  // const [squares, setSquares] = useState(Array(9).fill(null)); //creates an array with nine elements and sets each of them to null

  function handleClick(arrayIndex) {
    if (calculateWinner(squares)) {
      return;
    }
    const newSquares = squares.slice(); // Create a copy of the squares array, because of immutability
    if (newSquares[arrayIndex]) return; // Prevent overwriting a square that is already filled
    newSquares[arrayIndex] = xIsNext ? "X" : "O"; // ternary to check if X is next, if not play O instead
    
    onPlay(newSquares); //Update state with the new squares array

  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  // Split the squares array into chunks of 3 to create rows
  const rows = [];
  for (let i = 0; i < squares.length; i += 3) {
    rows.push(squares.slice(i, i + 3));
  }

  return (
    <>
    <div>
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="board-row" style={{ display: "flex" }}>
          {row.map((value, index) => (
            <Square
              key={rowIndex * 3 + index}
              value={value}
              onSquareClick={() => handleClick(rowIndex * 3 + index)} // arrow fnction to calculate the index for the square in the 1D array based on its row and column.
            />
          ))}
        </div>

        //THE ABOVE IS A REFACTORING OF THE BELOW:
        // <div className="board-row">
        // <Square value={squares[0]} />
        // <Square value={squares[1]} />
        // <Square value={squares[2]} />
        // </div>
        // <div className="board-row">
        // <Square value={squares[3]} />
        // <Square value={squares[4]} />
        // <Square value={squares[5]} />
        // </div>
        // <div className="board-row">
        // <Square value={squares[6]} />
        // <Square value={squares[7]} />
        // <Square value={squares[8]} />
        // </div>
      ))}
    </div>
    <div className="status">{status}</div>
    </>
  );
}

//------------------------------------------------------------//

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}