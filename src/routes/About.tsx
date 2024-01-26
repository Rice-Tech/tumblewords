import { useState } from "react";

const About = () => {
    const [miniGameNumber, setMiniGameNumber] = useState("");

  return (
  <div>About
    <input onChange={event => setMiniGameNumber(event.target.value)}></input>
    {miniGameNumber === "game1" && <h2>Mini Game 1</h2>}
    {miniGameNumber === "game2" && <h2>Mini Game 2</h2>}
  </div>);
};

export default About;
