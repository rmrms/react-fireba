import { useState, useEffect } from "react";
import "./practiceStyle.css";

const BoxGame = () => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(0)}>Reset</button>
      <button onClick={() => setCount(count - count * 2)}>
        Double the negative
      </button>
      <button onClick={() => setCount(count - count * 3)}>
        Triple the negative
      </button>
      <button onClick={() => setIsVisible(!isVisible)}>
        {isVisible ? "Elrejtés" : "Mutatás"}
      </button>
      {isVisible && <p>Ezt a szöveget feltételesen jelenítjük meg!</p>}
    </div>
  );
};

export default BoxGame;
