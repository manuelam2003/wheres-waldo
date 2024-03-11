import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import sound from "../utils/sound";
import buttonSound from "./assets/sounds/button-sound.wav";

function ErrorPage({ error }) {
  return (
    <div className="errorPage">
      <h2>{error.message || "Something went wrong. ❤️"}</h2>
      <Link to="/">
        <button className="errorHomeButton" onClick={() => sound(buttonSound)}>
          Home
        </button>
      </Link>
    </div>
  );
}

ErrorPage.propTypes = {
  error: PropTypes.object,
};

export default ErrorPage;
