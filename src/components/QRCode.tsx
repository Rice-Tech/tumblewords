import { useEffect, useRef } from "react";
import QRCodeStyling from "qr-code-styling";

const qrCode = new QRCodeStyling({
  width: 300,
  height: 300,
  image:
    "../TumbleWorksLogo.svg",
  dotsOptions: {
    color: "#4267b2",
    type: "rounded"
  },
  imageOptions: {
    crossOrigin: "anonymous",
    margin: 20
  }
});

interface Props{
    url: string;
}
export default function QRCode({url}:Props) {
  
  const ref = useRef(null);

  useEffect(() => {
    if(!ref.current){
        return
    }
    qrCode.append(ref.current);
  }, []);

  useEffect(() => {
    qrCode.update({
      data: url
    });
  }, [url]);



  return (
    <div className="App">
      <div style={styles.inputWrapper}>
        <a target="_blank" href={url}>{url}</a>
        
      </div>
      <div ref={ref} />
    </div>
  );
}

const styles = {
  inputWrapper: {
    margin: "20px 0",
    display: "flex",
    justifyContent: "space-between",
    width: "100%"
  },
  inputBox: {
    flexGrow: 1,
    marginRight: 20
  }
};
