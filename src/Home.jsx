import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import beach from "./assets/images/waldo-beach.avif";
import downtown from "./assets/images/waldo-downtown.png";
import factory from "./assets/images/waldo-factory.webp";
import capitalize from "../utils/capitalize";
import sound from "../utils/sound";
import buttonSound from "./assets/sounds/button-sound.wav";

function Home({ setCurrentImage }) {
  const images = ["beach", "downtown", "factory"];

  return (
    <>
      <div className="homeContainer">
        <div className="gameCards">
          {images.map((image) => (
            <Link
              key={image}
              to="/game"
              onClick={() => {
                setCurrentImage(image), sound(buttonSound);
              }}
            >
              <div className="cardDescription">
                <p>{capitalize(image)}</p>
              </div>
              <div className="gameCard">
                <div className="gameCardImageContainer">
                  <img
                    src={
                      image === "beach"
                        ? beach
                        : image === "downtown"
                          ? downtown
                          : factory
                    }
                    alt={
                      image === "beach"
                        ? "Find Waldo at a beach."
                        : image === "downtown"
                          ? "Find Waldo in a city."
                          : "Find Waldo in a factory."
                    }
                    className="gameCardImage"
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

Home.propTypes = {
  setCurrentImage: PropTypes.func.isRequired,
};

export default Home;
