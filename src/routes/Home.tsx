import React from "react";
import {Link, Form} from "react-router-dom";

export function loader(event:HTMLElementEventMap){
    const gameId = event.formdata.formData.get("gameId");

}

const Home = () => {
  const roomId = 456;
  return (
    <>
      <h1>Tumblewords</h1>
      <Link to={"/game/host/" + roomId}><button>Start a New Game</button></Link>
      <br/>
      <br/>
      <br/>
      <Form method="get">
        <label htmlFor="gameId">Game Id: </label>
        <input name="gameId" id="gameId" placeholder="Game ID" type="text"></input>
        <button type="submit">Join Game</button>
      </Form>
    </>
  );
};

export default Home;
