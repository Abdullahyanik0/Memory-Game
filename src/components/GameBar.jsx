import React, { useEffect, useState } from "react";
import useShuffle from "../hooks/use-shuffle-array";
import { data } from "../data";

const GameBar = () => {
  const [animals, setAnimals] = useState(data);
  const [flipControl, setFlipControl] = useState([]);
  const [shuffleArray] = useShuffle(data);
  const [resetShuffle, setResetShuffle] = useState();
  const [disabledButton, setDisabledButton] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  function handleReset() {
    setFlipControl([]);
    setResetShuffle(animals);
    setAnimals(shuffleArray);
    setGameOver(false);
  }

  const handleFlip = (item) => {
    const newAnimals = animals.map((animal) => (animal.id === item.id ? { ...animal, setFlip: true } : animal));
    setAnimals(newAnimals);
    setFlipControl([...flipControl, item]);
  };

  useEffect(() => {
    setAnimals(shuffleArray);
  }, [resetShuffle]);

  useEffect(() => {
    const flipLength = flipControl?.length === 2;
    const firstItem = flipControl[0]?.emoji;
    const secondItem = flipControl[1]?.emoji;
    const sameItem = firstItem && firstItem === secondItem;

    if (sameItem) {
      const newAnimals = animals.map((animal) => (animal.emoji === firstItem ? { ...animal, flip: true } : animal));
      setAnimals(newAnimals);
    }
    if (firstItem && secondItem && firstItem !== secondItem) {
      setDisabledButton(true);
      setTimeout(() => {
        setFlipControl([]);
        animals.map((animal) => (animal.setFlip = false));
        setDisabledButton(false);
      }, 700);
    }

    if (flipLength) {
      setFlipControl([]);
      setTimeout(() => {
        animals.map((animal) => (animal.setFlip = false));
      }, 500);
    }
  }, [animals, flipControl]);

  useEffect(() => {
    const allFlipTrue = animals.every((item) => item.flip);
    if (allFlipTrue) {
      setGameOver(true);
    }
  }, [animals]);

  return (
    <div className="flex flex-col w-full h-full justify-center items-center gap-4 select-none ">
      <div className="flex items-center gap-x-4 justify-center mb-5 -mt-20 sm:mt-0">
        <h1 className="text-4xl z-10">Memory Game</h1>
        <button className="text-3xl z-10 text-yellow-600" onClick={handleReset}>
          Reset
        </button>
      </div>
      <div className="grid grid-cols-4 sm:place-items-center grid-rows-3 w-[95%] sm:w-9/12 max-w-[700px] text-7xl sm:text-9xl h-[380px] sm:h-[700px] gap-3 sm:gap-5">
        {animals?.map((item, i) => (
          <button disabled={disabledButton} key={i} onClick={() => handleFlip(item)} className="flip-card h-full md:w-48 leading-relaxed cursor-pointer select-none relative">
            <div
              className="flip-card-inner flip-card-animate transform  flex justify-center"
              style={item.setFlip || item.flip ? { transform: "rotateY(0deg)" } : { transform: "rotateY(-180deg)" }}
            >
              <div className="flip-card-front max-w-[160px]  bg-white items-center rounded-lg  absolute top-0 left-0 right-0 bottom-0 transition-transform duration-3 transform rotateY-0 flip-card-animate-front">
                {item.emoji}
              </div>
              <div className="flip-card-backface absolute top-0 left-0 right-0 bottom-0  overflow-hidden flip-card-animate-back ">
                <img
                  className=" h-full object-contain sm:object-contain select-none"
                  src="https://www.x-decks.com/wp-content/uploads/fe77980e55ac810a655ae33ef53e602f_original_jpg_80.jpg"
                  alt=""
                />
              </div>
            </div>
          </button>
        ))}
      </div>
      {gameOver && (
        <div className="absolute bg-black/70 w-full h-full flex flex-col justify-center items-center text-5xl sm:text-8xl">
          <h1 className="-mt-24">Congratulations</h1>
          <button className="text-5xl mt-5 text-yellow-600" onClick={handleReset}>
            Reset
          </button>
        </div>
      )}
    </div>
  );
};

export default GameBar;
