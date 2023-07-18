import React, { useState, useEffect, useRef } from 'react';

const ROWS = 40;
const COLS = 40;
const CELL_SIZE = 10;
const INITIAL_SNAKE = [
  { row: 10, col: 10 },
  { row: 10, col: 9 },
  { row: 10, col: 8 },
];
const INITIAL_DIRECTION = 'RIGHT';
const INITIAL_SPEED = 200;

function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState(getRandomFoodPosition());
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const gameBoardRef = useRef(null)

  useEffect(() => {
    const timer = setInterval(moveSnake, speed);
    gameBoardRef.current.focus();
    return () => clearInterval(timer);
  }, [snake, direction, speed]);

  function handleKeyDown(event) {
    event.preventDefault();
    const key = event.keyCode;
    if (key === 37 && direction !== 'RIGHT') setDirection('LEFT');
    else if (key === 38 && direction !== 'DOWN') setDirection('UP');
    else if (key === 39 && direction !== 'LEFT') setDirection('RIGHT');
    else if (key === 40 && direction !== 'UP') setDirection('DOWN');
  }

  function moveSnake() {
    if (gameOver) return;

    const head = { ...snake[0] };
    switch (direction) {
      case 'LEFT':
        head.col -= 1;
        break;
      case 'UP':
        head.row -= 1;
        break;
      case 'RIGHT':
        head.col += 1;
        break;
      case 'DOWN':
        head.row += 1;
        break;
      default:
        break;
    }

    const newSnake = [head, ...snake.slice(0, -1)];
    setSnake(newSnake);

    if (
      isSnakeCollidingWithWall(head) ||
      isSnakeCollidingWithItself(head)
    ) {
      setGameOver(true);
    }

    if (isSnakeEatingFood(head)) {
      setScore(prevScore => prevScore + 1);
      setSpeed(prevSpeed => prevSpeed - 5);
      setFood(getRandomFoodPosition());
      enlargeSnake();
    }
  }

  function isSnakeCollidingWithWall(head) {
    return (
      head.row < 0 ||
      head.row >= ROWS ||
      head.col < 0 ||
      head.col >= COLS
    );
  }

  function isSnakeCollidingWithItself(head) {
    return snake.slice(1).some(segment => segment.row === head.row && segment.col === head.col);
  }

  function isSnakeEatingFood(head) {
    return head.row === food.row && head.col === food.col;
  }

  function enlargeSnake() {
    const tail = { ...snake[snake.length - 1] };
    setSnake(prevSnake => [...prevSnake, tail]);
  }

  function getRandomFoodPosition() {
    while (true) {
      const randomRow = Math.floor(Math.random() * ROWS);
      const randomCol = Math.floor(Math.random() * COLS);
      const isSnakeCell = snake.some(
        segment => segment.row === randomRow && segment.col === randomCol
      );
      if (!isSnakeCell) {
        return { row: randomRow, col: randomCol };
      }
    }
  }

  function restartGame() {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(getRandomFoodPosition());
    setSpeed(INITIAL_SPEED);
    setGameOver(false);
    setScore(0);
    gameBoardRef.current.focus();
  }

  function renderCells() {
    const cells = [];
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const isSnakeCell = snake.some(
          segment => segment.row === row && segment.col === col
        );
        const isFoodCell = food.row === row && food.col === col;
        cells.push(
          <div
            className={`cell ${isSnakeCell ? 'snake' : ''} ${isFoodCell ? 'food' : ''}`}
            key={`${row}-${col}`}
            style={{
              width: CELL_SIZE,
              height: CELL_SIZE,
              backgroundColor: isSnakeCell ? '#333' : isFoodCell ? '#ff6f00' : '#f2f2f2',
            }}
          />
        );
      }
    }
    return cells;
  }

  return (
    <div className="snake-game" tabIndex="0" ref={gameBoardRef} onKeyDown={handleKeyDown}>
      <h1>Snake Game</h1>
      <div className="game-container">
        <div
            className="game-board"
            style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${COLS}, ${CELL_SIZE}px)`,
            gridTemplateRows: `repeat(${ROWS}, ${CELL_SIZE}px)`,
            }}
        >
            {renderCells()}
        </div>
      </div>      
      {gameOver && (
        <div className="game-over">
          Game Over!
          <button onClick={restartGame}>Restart</button>
        </div>
      )}
      <div className="score">Score: {score}</div>
    </div>
  );
}

export default SnakeGame;
