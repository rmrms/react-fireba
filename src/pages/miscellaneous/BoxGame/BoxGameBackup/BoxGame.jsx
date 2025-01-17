import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../../../config/firebase";
import "./style/style.css";

const colors = [
  "#FF5733",
  "#33FF57",
  "#3357FF",
  "#F333FF",
  "#FF33A1",
  "#33FFF5",
  "#F5FF33",
  "#FF8C33",
];

const BoxGame = () => {
  const [boxList, setBoxList] = useState([]);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const timerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (boxList.length >= 32 || score >= 500) {
      setIsGameOver(true);
      setIsButtonDisabled(true); // Disable the button immediately
      clearInterval(timerRef.current);
      alert("Game Over! Your score: " + score);
    }
  }, [boxList.length, score]);

  useEffect(() => {
    if (isGameOver) {
      clearInterval(timerRef.current);
    }
  }, [isGameOver]);

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
  };

  const generateRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  };

  const checkAndRemovePairs = (newBoxList) => {
    let foundPair = false;
    for (let i = 0; i < newBoxList.length; i++) {
      if (
        (i % 8 !== 7 && newBoxList[i] === newBoxList[i + 1]) || // right
        (i % 8 !== 0 && newBoxList[i] === newBoxList[i - 1]) || // left
        (i >= 8 && newBoxList[i] === newBoxList[i - 8]) || // above
        (i < 24 && newBoxList[i] === newBoxList[i + 8]) // below
      ) {
        setScore((prev) => prev + 50);
        setTimeout(() => {
          const updatedBoxList = newBoxList.filter(
            (_, index) =>
              index !== i &&
              index !== i + 1 &&
              index !== i - 1 &&
              index !== i - 8 &&
              index !== i + 8
          );
          setBoxList(updatedBoxList);
          checkAndRemovePairs(updatedBoxList);
        }, 3000); // 3 seconds delay
        foundPair = true;
        break;
      }
    }
    return foundPair;
  };

  const addBox = () => {
    if (isGameOver) {
      return;
    }

    if (boxList.length === 0) {
      startTimer();
    }

    const newColor = generateRandomColor();
    const newBoxList = [...boxList, newColor];
    setBoxList(newBoxList);

    if (!checkAndRemovePairs(newBoxList)) {
      setIsButtonDisabled(false);
    }
  };

  const handleAddBoxClick = () => {
    if (!isButtonDisabled && !isGameOver) {
      addBox();
      setIsButtonDisabled(true);
    }
  };

  return (
    <div>
      <header className="bg-header">
        <h1>Box Game</h1>
        <p>
          Generate boxes with random colors. Match two adjacent boxes of the
          same color to earn points. The game ends when the container is full or
          the score reaches 500. Good luck!
        </p>
      </header>
      <div className="score-timer">
        <p>Score: {score}</p>
        <p>Time: {timer}s</p>
      </div>
      <button
        onClick={handleAddBoxClick}
        disabled={isGameOver || isButtonDisabled}
      >
        Generate Box
      </button>
      <div className="box-container">
        {boxList.map((color, index) => (
          <div
            key={index}
            className="box"
            style={{ backgroundColor: color }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default BoxGame;
