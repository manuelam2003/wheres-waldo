import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import beach from "./assets/images/waldo-beach.avif";
import downtown from "./assets/images/waldo-downtown.png";
import factory from "./assets/images/waldo-factory.webp";
import sound from "../utils/sound";
import buttonSound from "./assets/sounds/button-sound.wav";
import correctSound from "./assets/sounds/correct-sound.wav";
import errorSound from "./assets/sounds/error-sound.wav";
import winSound from "./assets/sounds/win-sound.wav";
import ErrorPage from "./ErrorPage.jsx";
import Loading from "./Loading.jsx";

function Game({ currentImage }) {
  const [boxPosition, setBoxPosition] = useState({ x: 0, y: 0 });
  const [showBox, setShowBox] = useState("none");
  const [characters, setCharacters] = useState(null);
  const [foundCharacters, setFoundCharacters] = useState([]);
  const [remainingCharacters, setRemainingCharacters] = useState([]);
  const [imageDimensions, setImageDimensions] = useState(null);
  const [currentWidth, setCurrentWidth] = useState(null);
  const [currentHeight, setCurrentHeight] = useState(null);
  const [username, setUsername] = useState("");
  const [gameTime, setGameTime] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const gameOverModal = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://haminimi-where-is-waldo.glitch.me/images/${currentImage}`
        );
        const data = await response.json();
        setCharacters(data.image.characters);
        setRemainingCharacters(data.image.characters);
        setImageDimensions(data.image.dimensions);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentImage]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://haminimi-where-is-waldo.glitch.me/game/finished`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          }
        );
        const data = await response.json();
        setGameTime(data.gameTimeInSeconds);
      } catch (error) {
        setError(error);
      }
    };

    if (
      foundCharacters.length > 0 &&
      foundCharacters.length === characters.length
    ) {
      fetchData();
      gameOverModal.current && gameOverModal.current.showModal();
      sound(winSound);
    }
  }, [foundCharacters]);

  useEffect(() => {
    const remaining =
      characters &&
      characters.filter((character) => {
        return !foundCharacters.some(
          (found) => found.character === character.character
        );
      });
    setRemainingCharacters(remaining);
  }, [characters, foundCharacters]);

  function handleImageClick(e) {
    setCurrentImageDimensions();
    positionBox(e);
  }

  function setCurrentImageDimensions() {
    const image = imageRef.current;
    const currentWidth = image.width;
    const currentHeight = image.height;
    setCurrentWidth(currentWidth);
    setCurrentHeight(currentHeight);
  }

  function positionBox(e) {
    const image = e.target;
    const boundingBox = image.getBoundingClientRect();

    const x = e.clientX - boundingBox.left;
    const y = e.clientY - boundingBox.top;

    setBoxPosition({ x, y });
    setShowBox("flex");
  }

  function handleCharacterPick(selectedCharacter) {
    setShowBox("none");
    const characterData = characters.find(
      (character) => character.character === selectedCharacter
    );
    const alreadyFound = foundCharacters.find(
      (character) => character.character === selectedCharacter
    );
    if (alreadyFound) {
      return;
    } else {
      const widthScaleFactor = currentWidth / imageDimensions.width;
      const heightScaleFactor = currentHeight / imageDimensions.height;

      const normalizedMinX = characterData.minX * widthScaleFactor;
      const normalizedMaxX = characterData.maxX * widthScaleFactor;
      const normalizedMinY = characterData.minY * heightScaleFactor;
      const normalizedMaxY = characterData.maxY * heightScaleFactor;
      if (
        boxPosition.x > normalizedMinX &&
        boxPosition.x < normalizedMaxX &&
        boxPosition.y > normalizedMinY &&
        boxPosition.y < normalizedMaxY
      ) {
        sound(correctSound);
        setFoundCharacters((foundCharacters) => [
          ...foundCharacters,
          {
            character: selectedCharacter,
            x: boxPosition.x,
            y: boxPosition.y,
          },
        ]);
      } else {
        sound(errorSound);
      }
    }
  }

  function submitScore(e) {
    e.preventDefault();

    const requestData = {
      image: currentImage,
      user: username,
      score: Math.floor(gameTime),
    };

    const postScore = async () => {
      try {
        const response = await fetch(
          "https://haminimi-where-is-waldo.glitch.me/scores/submit",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestData),
          }
        );
      } catch (error) {
        setError(error);
      }
    };

    postScore();
    gameOverModal.current.close();
    navigate("/leaderboard");
  }

  function closeModal() {
    sound(buttonSound);
    restartGame();
    gameOverModal.current.close();
  }

  function restartGame() {
    const restartTimer = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://haminimi-where-is-waldo.glitch.me/images/${currentImage}`
        );
        const data = await response.json();
        setCharacters(data.image.characters);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    restartTimer();
    setFoundCharacters([]);
    setGameTime(null);
  }

  const boxStyle = {
    left: `${boxPosition.x - 30}px`,
    top: `${boxPosition.y - 30}px`,
    display: `${showBox}`,
  };

  if (error) return <ErrorPage error={error} />;
  if (loading) return <Loading />;

  return (
    <>
      <div className="gameContainer">
        <div className="imageContainer">
          <img
            ref={imageRef}
            src={
              currentImage === "beach"
                ? beach
                : currentImage === "downtown"
                  ? downtown
                  : factory
            }
            alt={
              currentImage === "beach"
                ? "Find Waldo at a beach."
                : currentImage === "downtown"
                  ? "Find Waldo in a city."
                  : "Find Waldo in a factory."
            }
            className="gameImage"
            onClick={handleImageClick}
          />
          {showBox && (
            <div className="targetingBoxContainer" style={boxStyle}>
              <div className="targetingBox"></div>
              <div className="characters">
                {remainingCharacters &&
                  remainingCharacters.map((character) => (
                    <button
                      key={character.character}
                      onClick={() => handleCharacterPick(character.character)}
                    >
                      {character.character}
                    </button>
                  ))}
              </div>
            </div>
          )}
          {foundCharacters.map((character) => (
            <div
              key={character.character}
              className="foundCharacterCircle"
              style={{
                left: `${character.x - 30}px`,
                top: `${character.y - 30}px`,
              }}
            ></div>
          ))}
          <dialog ref={gameOverModal} className="gameOverModal">
            <div className="modalContent">
              <h2>
                Hooray! You have found all the characters in{" "}
                {Math.floor(gameTime)}s.
              </h2>
              <form action="" onSubmit={submitScore}>
                <div className="formGroup">
                  <label htmlFor="usernameInput">
                    <b>Username:</b>
                  </label>
                  <input
                    id="usernameInput"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    min={1}
                    required
                  />
                </div>
                <div className="restartAndSubmit">
                  <button onClick={closeModal} className="restartButton">
                    Restart
                  </button>
                  <button
                    type="submit"
                    onClick={() => sound(buttonSound)}
                    className="submitButton"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </dialog>
        </div>
      </div>
    </>
  );
}

Game.propTypes = {
  currentImage: PropTypes.string.isRequired,
};

export default Game;
