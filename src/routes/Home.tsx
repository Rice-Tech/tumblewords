import React, { FormEvent } from "react";

import {Link, Form, useNavigate} from "react-router-dom";

export function loader(event:HTMLElementEventMap){
    const gameId = event.formdata.formData.get("gameId");

}

const Home = () => {
  const roomId = "test";
  const navigate = useNavigate();
  const handleSubmit = (event:FormEvent) =>{
    console.log(event);
    event.preventDefault();
    const gameId = event.target.gameId.value;
    console.log(gameId);
    navigate(`/game/${gameId}/play`)
    return
  }
  return (
    <>
      <h1>Tumblewords</h1>
      <Link to={"/game/" + roomId}><button>Start a New Game</button></Link>
      <br/>
      <br/>
      <br/>
      <Form action="" onSubmit={handleSubmit}>
        <label htmlFor="gameId">Game Id: </label>
        <input name="gameId" id="gameId" placeholder="Game ID" type="text"></input>
        <button type="submit">Join Game</button>
      </Form>
    </>
  );
};

export default Home;
