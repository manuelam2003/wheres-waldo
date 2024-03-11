import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import Header from "./Header";
import Home from "./Home";
import Game from "./Game";
import Leaderboard from "./Leaderboard";
import Footer from "./Footer";
import backgroundMusic from "./assets/sounds/background-music.mp3";

function App() {
  const [currentImage, setCurrentImage] = useState("beach");
  const [music, setMusic] = useState("off");
  const { name } = useParams();
  const location = useLocation();
  const currentPath = location.pathname;

  useEffect(() => {
    const audio = new Audio(backgroundMusic);
    const handleEnded = () => {
      audio.currentTime = 0;
      audio.play();
    };

    if (music === "on") {
      audio.loop = true;

      audio.addEventListener("ended", handleEnded);

      audio.play();
    } else {
      audio.pause();
    }

    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.pause();
    };
  }, [music]);

  return (
    <>
      <Header currentPath={currentPath} music={music} setMusic={setMusic} />
      {name === "game" ? (
        <Game currentImage={currentImage} />
      ) : name === "leaderboard" ? (
        <Leaderboard />
      ) : (
        <Home setCurrentImage={setCurrentImage} />
      )}
      <Footer />
    </>
  );
}

export default App;
