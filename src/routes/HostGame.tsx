import { useEffect } from "react";
import QRCodeStyling from "qr-code-styling";
import QRCode from "../components/QRCode";
import { useLocation } from 'react-router-dom';

const HostGame = () => {
    const location = useLocation();
  return (
    <>
      <div>HostGame</div>
      <QRCode url={window.location.href+"/"+"play"} />
    </>
  );
};

export default HostGame;
