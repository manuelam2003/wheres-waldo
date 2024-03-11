import { useState, useEffect } from "react";
import ErrorPage from "./ErrorPage.jsx";
import Loading from "./Loading.jsx";
import capitalize from "../utils/capitalize";
import sound from "../utils/sound";
import buttonSound from "./assets/sounds/button-sound.wav";
import { v4 as uuidv4 } from "uuid";

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    retrieveAllScores();
  }, []);

  function retrieveAllScores() {
    const fetchData = async () => {
      try {
        // TODO put my own link
        const response = await fetch(
          "https://haminimi-where-is-waldo.glitch.me/scores"
        );
        const data = await response.json();
        setLeaderboard(data.scores);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }

  function retrieveScores(game) {
    sound(buttonSound);
    const fetchData = async () => {
      try {
        // TODO Put my own link
        const response = await fetch(
          `https://haminimi-where-is-waldo.glitch.me/scores/${game}`
        );
        const data = await response.json();
        setLeaderboard(data.scores);
      } catch (error) {
        setError(error);
      }
    };

    fetchData();
  }

  if (error) return <ErrorPage error={error} />;
  if (loading) return <Loading />;

  return (
    <>
      <div className="leaderboardContainer">
        <h1 className="leaderboardHeader">Leaderboard</h1>
        <nav className="leaderboardCriteria">
          <button
            onClick={() => {
              retrieveAllScores(), sound(buttonSound);
            }}
          >
            All games
          </button>
          <button onClick={() => retrieveScores("beach")}>Beach</button>
          <button onClick={() => retrieveScores("downtown")}>Downtown</button>
          <button onClick={() => retrieveScores("factory")}>Factory</button>
        </nav>
        <div className="leaderboardScores">
          {leaderboard.length > 0 &&
            leaderboard.map((score) => (
              <div key={uuidv4()} className="leaderboardScore">
                <p className="leaderboardScoreIndex">
                  {`${leaderboard.indexOf(score) + 1}.`}
                </p>
                <p className="leaderboardScoreGame">
                  <b>{capitalize(score.image)}</b>
                </p>
                <p className="score">
                  @{`${score.user}`}: <b>{`${score.score}`}s</b>
                </p>
              </div>
            ))}
          {leaderboard.length < 1 && (
            <h2>There are no scores for this game.</h2>
          )}
        </div>
      </div>
    </>
  );
}

export default Leaderboard;
