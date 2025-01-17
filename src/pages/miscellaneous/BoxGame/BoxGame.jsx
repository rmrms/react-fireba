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
    console.log(
      "useEffect triggered - boxList.length:",
      boxList.length,
      "score:",
      score
    );
    if (boxList.length >= 32 || score >= 500) {
      setIsGameOver(true);
      setIsButtonDisabled(true); // Disable the button immediately
      clearInterval(timerRef.current);
      alert("Game Over! Your score: " + score);
    }
  }, [boxList.length, score]);

  useEffect(() => {
    console.log("Game over effect triggered:", isGameOver);
    if (isGameOver) {
      clearInterval(timerRef.current);
    }
  }, [isGameOver]);

  const startTimer = () => {
    console.log("Timer started");
    timerRef.current = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
  };

  const generateRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * colors.length);
    const color = colors[randomIndex];
    console.log("Generated color:", color);
    return color;
  };

  const calculateFinalScore = () => {
    const timePenalty = Math.min(timer, 10); // Penalty points for time taken
    const finalScore = score - timePenalty;
    return finalScore;
  };
  const highlightPairs = (pairs) => {
    const highlightedBoxList = boxList.map((color, index) =>
      pairs.has(index) ? "yellow" : color
    );
    setBoxList(highlightedBoxList);
  };

  const checkAndRemovePairs = (newBoxList) => {
    console.log("Checking for pairs in boxList:", newBoxList);
    let foundPair = false;
    const boxesToRemove = new Set();

    for (let i = 0; i < newBoxList.length; i++) {
      if (
        (i % 8 !== 7 && newBoxList[i] === newBoxList[i + 1]) || // right
        (i % 8 !== 0 && newBoxList[i] === newBoxList[i - 1]) || // left
        (i >= 8 && newBoxList[i] === newBoxList[i - 8]) || // above
        (i < 24 && newBoxList[i] === newBoxList[i + 8]) // below
      ) {
        console.log("Pair found at index:", i, "color:", newBoxList[i]);
        if (!foundPair) {
          setScore((prev) => prev + 10);
        }
        boxesToRemove.add(i);
        if (i % 8 !== 7) boxesToRemove.add(i + 1); // right pair
        if (i % 8 !== 0) boxesToRemove.add(i - 1); // left pair
        if (i >= 8) boxesToRemove.add(i - 8); // above pair
        if (i < 24) boxesToRemove.add(i + 8); // below pair

        foundPair = true;
      }
    }

    if (foundPair) {
      highlightPairs(boxesToRemove);
      setTimeout(() => {
        const updatedBoxList = newBoxList.filter(
          (_, index) => !boxesToRemove.has(index)
        );
        console.log("Updated box list after removing pairs:", updatedBoxList);
        setBoxList(updatedBoxList);
        setTimeout(() => {
          checkAndRemovePairs(updatedBoxList);
        }, 300); // Delay to visually remove pairs
      }, 500); // Delay to highlight pairs
    } else {
      setIsButtonDisabled(false);
    }

    if (score >= 500) {
      const timeBonus = Math.max(0, 10 - timer); // Bonus points for faster completion
      const totalScore = score + timeBonus;
      alert("Congratulations! Your total score: " + totalScore);
      clearInterval(timerRef.current);
      setIsGameOver(true);
      setIsButtonDisabled(true); // Disable the button immediately
    } else {
      setIsButtonDisabled(false);
    }
    return foundPair;
  };

  const displayScoreBoard = () => {
    const finalScore = calculateFinalScore();
    alert(`Game Over! Your final score: ${finalScore}`);
  };

  useEffect(() => {
    if (isGameOver) {
      displayScoreBoard();
    }
  }, [isGameOver]);
  const ScoreBoard = () => {
    const finalScore = calculateFinalScore();
    return (
      <div className="score-board">
        <h2>Score Board</h2>
        <p>Final Score: {finalScore}</p>
        <p>Time Taken: {timer}s</p>
      </div>
    );
  };
  const addBox = () => {
    if (isGameOver) {
      console.log("Game over, cannot add box");
      return;
    }

    if (boxList.length === 0) {
      startTimer();
    }

    const newColor = generateRandomColor();
    const newBoxList = [...boxList, newColor];
    console.log("New box list after adding color:", newBoxList);
    setBoxList(newBoxList);

    checkAndRemovePairs(newBoxList);
    setIsButtonDisabled(false);
    console.log("Button re-enabled after checking pairs");
  };

  const handleAddBoxClick = () => {
    console.log("Generate Box button clicked");
    if (!isButtonDisabled && !isGameOver) {
      setIsButtonDisabled(true);
      addBox();
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
      {isGameOver && <ScoreBoard />}
    </div>
  );
};

export default BoxGame;
