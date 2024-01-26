
import QRCode from "../components/QRCode";


const HostGame = () => {
  return (
    <>
      <div>HostGame</div>
      <QRCode url={window.location.href+"/"+"play"} />
    </>
  );
};

export default HostGame;
