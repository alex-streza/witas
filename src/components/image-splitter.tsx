"use client";
import { Download } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import {
  compressImage,
  fileToBase64,
  urlToBase64,
  urltoFile,
} from "~/utils/images";

export const ImageSplitter = ({ imageUrl }: { imageUrl: string }) => {
  const [base64Images, setBase64Images] = useState<string[]>([]);

  const canvasRefs = [
    useRef<HTMLCanvasElement>(null),
    useRef<HTMLCanvasElement>(null),
    useRef<HTMLCanvasElement>(null),
    useRef<HTMLCanvasElement>(null),
  ];

  useEffect(() => {
    const inputImage = new Image();
    inputImage.crossOrigin = "anonymous"; // Enable CORS if needed
    inputImage.src = imageUrl;

    const drawCanvas = ({
      ctx,
      sx,
      sy,
      sWidth,
      sHeight,
      dx,
      dy,
      dWidth,
      dHeight,
    }: {
      ctx: CanvasRenderingContext2D;
      sx: number;
      sy: number;
      sWidth: number;
      sHeight: number;
      dx: number;
      dy: number;
      dWidth: number;
      dHeight: number;
    }) => {
      ctx.drawImage(
        inputImage,
        sx,
        sy,
        sWidth,
        sHeight,
        dx,
        dy,
        dWidth,
        dHeight
      );
    };

    inputImage.onload = () => {
      const imageWidth = inputImage.width;
      const imageHeight = inputImage.height;
      const canvasWidth = imageWidth / 2;
      const canvasHeight = imageHeight / 2;

      const base64ImagesArr: string[] = [];

      canvasRefs.forEach((canvasRef, index) => {
        if (!canvasRef.current) return;

        const ctx = canvasRef.current.getContext("2d");

        if (!ctx) return;

        canvasRef.current.width = canvasWidth;
        canvasRef.current.height = canvasHeight;

        const sx = (index % 2) * canvasWidth;
        const sy = Math.floor(index / 2) * canvasHeight;

        drawCanvas({
          ctx,
          sx,
          sy,
          sWidth: canvasWidth,
          sHeight: canvasHeight,
          dx: 0,
          dy: 0,
          dWidth: canvasWidth,
          dHeight: canvasHeight,
        });

        // Convert canvas to base64
        const base64Image = canvasRef.current.toDataURL("image/png");
        base64ImagesArr.push(base64Image);
      });

      setBase64Images(base64ImagesArr);
    };
  }, [canvasRefs, imageUrl]);

  const handleDownload = async (base64Image: string, index: number) => {
    const { url: optimizedUri } = (await fetch("/api/optimize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: await fileToBase64(
          await compressImage(
            await urltoFile(base64Image, "image.png", "image/png")
          )
        ),
      }),
    }).then((res) => res.json())) as { url?: string };

    if (!optimizedUri) return;

    const downloadLink = document.createElement("a");
    downloadLink.href = await urlToBase64(optimizedUri);
    downloadLink.download = `sticker_v${index}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div className="absolute inset-0 z-20 aspect-square w-full">
      <div className="grid h-full grid-cols-2">
        {canvasRefs.map((canvasRef, index) => (
          <div className="relative h-full w-full" key={index}>
            <canvas ref={canvasRef} className="h-full w-full"></canvas>
            {base64Images.length > 0 && (
              <button
                className="absolute bottom-0 left-0 z-10 grid w-full place-content-center bg-gradient-to-b from-transparent to-zinc-900 p-3"
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                onClick={() =>
                  handleDownload(base64Images[index] as string, index)
                }
              >
                <Download size={32} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
