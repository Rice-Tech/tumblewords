import { useState } from "react";
import App from "../App";

const About = () => {
    const [miniGameNumber, setMiniGameNumber] = useState("");

  return (
  <div>About
    <input onChange={event => setMiniGameNumber(event.target.value)}></input>
    {miniGameNumber === "game1" && <App/>}
    {miniGameNumber === "game2" && <h2>Mini Game 2</h2>}
  </div>);
};

export default About;
