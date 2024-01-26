import { FormEvent } from "react";

import { Link, useNavigate } from "react-router-dom";


const Home = () => {
  const roomId = "test";
  const navigate = useNavigate();
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const gameId = (event.target as HTMLFormElement).gameId.value;
    navigate(`/game/${gameId}/play`);
    return;
  };
  return (
    <>
      <h1>Tumblewords</h1>
      <Link to={"/game/" + roomId}>
        <button>Start a New Game</button>
      </Link>
      <br />
      <br />
      <br />
      <form onSubmit={handleSubmit}>
        <label htmlFor="gameId">Game Id: </label>
        <input
          name="gameId"
          id="gameId"
          placeholder="Game ID"
          type="text"
          required
        />
        <button type="submit">Join Game</button>
      </form>
    </>
  );
};

export default Home;
