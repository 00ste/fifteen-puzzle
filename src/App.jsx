import { useState } from 'react';
import { invoke } from '@tauri-apps/api'

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      { value }
    </button>
  )
}

function Board() {
  // initialize each square with consecutive numbers
  const [squares, setSquares] = useState(
    () => {
      let temp = Array(16);
      for (let i = 0; i < 15; i ++) {
        temp[i] = i+1;
      }
      temp[15] = null;
      return temp;
    }
  );

  // the empty position has coordinates [3, 3]
  const [empty, setEmpty] = useState(
    () => {
      let temp = [3, 3];
      return temp;
    }
  )

  // if possible, shift tiles towards the empty square
  function handleClick(y, x) {
    console.log("clicked cell", x, y);
    // create temp copy of squares
    const nextSquares = squares.slice();
    const nextEmpty = empty.slice();

    // calculate shifting direction
    let dx = Math.min(Math.max(empty[0]-x, -1), 1);
    let dy = Math.min(Math.max(empty[1]-y, -1), 1);
    
    // if the empty square was clicked exit
    if (dx == 0 && dy == 0) return;

    // if the empty square isn't aligned exit
    if (dx != 0 && dy != 0) return;

    // shift (recursive)
    shift(x, y, dx, dy, nextSquares, nextEmpty);

    // update the state
    setSquares(nextSquares);
    setEmpty(nextEmpty);
    console.log("final values: squares="+squares+", empty="+empty);
  }

  // tries to shift the square at (x, y) at a certain direction
  // dx or dy, if it can't it tries to shift the next square in
  // the same direction recursively until the borders are reached.
  function shift(x, y, dx, dy, squares, empty) {
    console.log("received x="+x+", y="+y+", dx="+dx+", dy="+dy+", squares="+squares+", empty="+empty);
    if (x < 0 || x >= 4) return;
    if (y < 0 || y >= 4) return;
    if ((empty[0] == x) && (empty[1] == y)) return;

    shift(x+dx, y+dy, dx, dy, squares, empty);

    if ((empty[0] == x+dx) && (empty[1] == y+dy)) {
      squares[x+dx + 4*(y+dy)] = squares[x + 4*y];
      squares[x + 4*y] = '';
      empty[0] = x;
      empty[1] = y;
    }
  }

  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0, 0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(0, 1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(0, 2)} />
        <Square value={squares[3]} onSquareClick={() => handleClick(0, 3)} />
      </div>
      <div className="board-row">
        <Square value={squares[4]} onSquareClick={() => handleClick(1, 0)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(1, 1)} />
        <Square value={squares[6]} onSquareClick={() => handleClick(1, 2)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(1, 3)} />
      </div>
      <div className="board-row">
        <Square value={squares[8]} onSquareClick={() => handleClick(2, 0)} />
        <Square value={squares[9]} onSquareClick={() => handleClick(2, 1)} />
        <Square value={squares[10]} onSquareClick={() => handleClick(2, 2)} />
        <Square value={squares[11]} onSquareClick={() => handleClick(2, 3)} />
      </div>
      <div className="board-row">
        <Square value={squares[12]} onSquareClick={() => handleClick(3, 0)} />
        <Square value={squares[13]} onSquareClick={() => handleClick(3, 1)} />
        <Square value={squares[14]} onSquareClick={() => handleClick(3, 2)} />
        <Square value={squares[15]} onSquareClick={() => handleClick(3, 3)} />
      </div>
    </>
  );
}

export default function App() {
  let board = <Board />;
  return(board);
}