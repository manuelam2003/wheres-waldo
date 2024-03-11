import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import waldo from "./assets/images/waldo.webp";
import sound from "../utils/sound";
import buttonSound from "./assets/sounds/button-sound.wav";

function Header({ currentPath, music, setMusic }) {
  function switchMusicWithKeyboard(event, action) {
    if (
      event.key === "Enter" ||
      event.key === " " ||
      event.key === "Spacebar"
    ) {
      if (action === "off") {
        setMusic("off");
      } else {
        setMusic("on");
      }
    }
  }

  return (
    <>
      <header>
        <img src={waldo} alt="" className="headerImage" />
        <nav className="headerNav">
          <Link
            to="/"
            className={currentPath === "/" ? "activeLink" : "inactiveLink"}
            onClick={() => sound(buttonSound)}
          >
            Home
          </Link>{" "}
          <Link
            to="/leaderboard"
            className={
              currentPath === "/leaderboard" ? "activeLink" : "inactiveLink"
            }
            onClick={() => sound(buttonSound)}
          >
            Leaderboard
          </Link>
          {music === "on" ? (
            <span
              className="material-symbols-outlined noteIcon"
              onClick={() => setMusic("off")}
              onKeyDown={(e) => switchMusicWithKeyboard(e, "off")}
              aria-label="Turn music off"
              tabIndex={0}
            >
              music_note
            </span>
          ) : (
            <span
              className="material-symbols-outlined noteIcon"
              onClick={() => setMusic("on")}
              onKeyDown={(e) => switchMusicWithKeyboard(e, "on")}
              aria-label="Turn music on"
              tabIndex={0}
            >
              music_off
            </span>
          )}
        </nav>
      </header>
    </>
  );
}

Header.propTypes = {
  currentPath: PropTypes.string.isRequired,
  music: PropTypes.string.isRequired,
  setMusic: PropTypes.func.isRequired,
};

export default Header;
