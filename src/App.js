import React, { useState, useEffect } from "react";
import "./App.css";

const ROWS = 15;
const COLS = 20;
const DROP_COUNT = 5; // Number of cubes selected at a time in each column

// Array of colors to randomly choose from
const COLORS = ["red", "yellow", "blue", "green", "purple", "orange", "cyan"];

// Function to generate a drop with random color
const generateDrop = (color) => {
  return {
    col: Math.floor(Math.random() * COLS), // Random column
    rowStart: Math.floor(Math.random() * (ROWS - DROP_COUNT)), // Random starting row
    color: color, // Random color
  };
};

const App = () => {
  const [drops, setDrops] = useState([]);
  const [color, setColor] = useState("red"); // Initial color is red

  // Change color every 3-5 seconds to a random color
  useEffect(() => {
    const colorInterval = setInterval(() => {
      // Pick a random color from the COLORS array
      const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
      setColor(randomColor);
    }, Math.random() * (5000 - 3000) + 3000); // Random interval between 3-5 seconds

    return () => clearInterval(colorInterval); // Clean up on component unmount
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setDrops((prevDrops) => {
        // Move existing drops down by 1 row
        const updatedDrops = prevDrops.map((drop) => ({
          ...drop,
          rowStart: drop.rowStart + 1,
        }));

        // Filter out drops that fall out of the grid
        const visibleDrops = updatedDrops.filter(
          (drop) => drop.rowStart + DROP_COUNT < ROWS
        );

        // Add a new drop with the current random color
        return [...visibleDrops, generateDrop(color)];
      });
    }, 300); // Adjust timing for speed

    return () => clearInterval(interval); // Clean up on component unmount
  }, [color]); // Re-run when color changes

  return (
    <div className="app">
      <header className="header">Dynamic Rain: Random Color Drops</header>
      <div className="grid">
        {Array.from({ length: ROWS }).map((_, rowIndex) => (
          <div key={rowIndex} className="row">
            {Array.from({ length: COLS }).map((_, colIndex) => {
              // Find the drop for the current cell
              const drop = drops.find((drop) => drop.col === colIndex);

              return (
                <div
                  key={colIndex}
                  className="cell"
                  style={{
                    background:
                      drop && drop.rowStart <= rowIndex && drop.rowStart + DROP_COUNT > rowIndex
                        ? drop.color
                        : "transparent",
                    animation:
                      drop && drop.rowStart <= rowIndex && drop.rowStart + DROP_COUNT > rowIndex
                        ? `fall 1s ease-out`
                        : "",
                  }}
                ></div>
              );
            })}
          </div>
        ))}
      </div>
      <footer className="footer">Made with React</footer>
    </div>
  );
};

export default App;
