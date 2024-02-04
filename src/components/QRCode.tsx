import { useEffect, useRef } from "react";
import QRCodeStyling from "qr-code-styling";
import { Button } from "./ui/button";

const qrCode = new QRCodeStyling({
  width: 500,
  height: 500,
  type: "svg",
  image: "../Logo.svg",
  dotsOptions: {
    color: "#slate",
    type: "rounded",
  },
  imageOptions: {
    crossOrigin: "anonymous",
    margin: 5,
  },
});

interface Props {
  url: string;
}
export default function QRCode({ url }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const ref2 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const createQR = () => {
      if (!ref.current) {
        return;
      }
      qrCode.append(ref.current);
      setTimeout(() => appendQR(), 100);
    };
    const appendQR = () => {
      if (!ref.current) {
        return;
      }
      const qrCodeSVG = ref.current.querySelector("svg");

      if (qrCodeSVG) {
        qrCodeSVG.setAttribute("viewBox", "0 0 500 500");
        qrCodeSVG.setAttribute("width", "100%");
        qrCodeSVG.setAttribute("height", "100%");
      }
    };

    createQR();
  }, []);

  useEffect(() => {
    qrCode.update({
      data: url,
    });
  }, [url]);

  return (
    <div className="m-auto flex-col justify-around">
      <Button className=" m-auto">
        <a className=" min-w-0" target="_blank" href={url}>
          Click to play
        </a>
      </Button>
      <div className=" max-w-80 svgParent" ref={ref2}>
        <div className=" flex justify-around w-full svgDump " ref={ref} />
      </div>
    </div>
  );
}
