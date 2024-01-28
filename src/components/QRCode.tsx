import { useEffect, useRef } from "react";
import QRCodeStyling from "qr-code-styling";
import { Button } from "./ui/button";

const qrCode = new QRCodeStyling({
  width: 300,
  height: 300,
  image: "../Logo.svg",
  dotsOptions: {
    color: "#slate",
    type: "rounded",
  },
  imageOptions: {
    crossOrigin: "anonymous",
    margin: 20,
  },
});

interface Props {
  url: string;
}
export default function QRCode({ url }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    qrCode.append(ref.current);
    const codeCanvas = ref.current.querySelector("canvas");
    if (!codeCanvas) {
      console.log("No Canvas");
      return;
    }
    codeCanvas.setAttribute("width", "");
    codeCanvas.setAttribute("height", "");
    codeCanvas.setAttribute("class", "w-full");
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
          {url}
        </a>
      </Button>

      <div className=" flex justify-around w-full" ref={ref} />
    </div>
  );
}
