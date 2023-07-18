import React, { useState, useEffect } from "react";

const ROWS = 20;
const COLS = 20;
const CELL_SIZE = 20;
const INITIAL_SNAKE = [
  { row: 10, col: 10 },
  { row: 10, col: 9 },
  { row: 10, col: 8 },
];
const INITIAL_DIRECTION = "RIGHT";
const INITIAL_SPEED = 200;

function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState(getRandomFoodPosition());
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const timer = setInterval(moveSnake, speed);
    return () => clearInterval(timer);
  }, [snake, direction, gameOver]);

  function handleKeyDown(event) {
    const key = event.keyCode;
    if (key === 37 && direction !== "RIGHT") setDirection("LEFT");
    else if (key === 38 && direction !== "DOWN") setDirection("UP");
    else if (key === 39 && direction !== "LEFT") setDirection("RIGHT");
    else if (key === 40 && direction !== "UP") setDirection("DOWN");
  };

  function moveSnake() {
    if (gameOver) return;

    const head = { row: snake[0].row, col: snake[0].col };
    switch (direction) {
      case "LEFT":
        head.col -= 1;
        break;
      case "UP":
        head.row -= 1;
        break;
      case "RIGHT":
        head.col += 1;
        break;
      case "DOWN":
        head.row += 1;
        break;
      default:
        break;
    }

    const newSnake = [head, ...snake];
    newSnake.pop();
    setSnake(newSnake);

    if (isSnakeCollidingWithWall(head) || isSnakeCollidingWithItself(head)) {
      setGameOver(true);
    }

    if (isSnakeEatingFood(head)) {
      setScore((prevScore) => prevScore + 1);
      setSpeed((prevSpeed) => prevSpeed - 5);
      setFood(getRandomFoodPosition());
      enlargeSnake();
    }
  };

  function isSnakeCollidingWithWall(head) {
    return (
      head.row < 0 ||
      head.row >= ROWS ||
      head.col < 0 ||
      head.col >= COLS
    );
  };

  function isSnakeCollidingWithItself(head) {
    for (let i = 1; i < snake.length; i++) {
      if (snake[i].row === head.row && snake[i].col === head.col) {
        return true;
      }
    }
    return false;
  };

  function isSnakeEatingFood(head) {
    return head.row === food.row && head.col === food.col;
  };

  function enlargeSnake() {
    const newTail = { row: snake[snake.length - 1].row, col: snake[snake.length - 1].col };
    setSnake((prevSnake) => [...prevSnake, newTail]);
  };

  function getRandomFoodPosition() {
    return {
      row: Math.floor(Math.random() * ROWS),
      col: Math.floor(Math.random() * COLS),
    };
  };

  function renderCells() {
    const cells = [];
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const isSnakeCell = snake.some((cell) => cell.row === row && cell.col === col);
        const isFoodCell = food.row === row && food.col === col;
        cells.push(
          <div
            className={`cell ${isSnakeCell ? "snake" : ""} ${isFoodCell ? "food" : ""}`}
            key={`${row}-${col}`}
          />
        );
      }
    }
    return cells;
  };

  return (
    <div className="snake-game" tabIndex="0" onKeyDown={handleKeyDown}>
      <h1>Snake Game</h1>
      <div className="game-board" style={{ width: COLS * CELL_SIZE, height: ROWS * CELL_SIZE }}>
        {renderCells()}
      </div>
      {gameOver && <div className="game-over">Game Over!</div>}
      <div className="score">Score: {score}</div>
    </div>
  );
};

export default SnakeGame;
