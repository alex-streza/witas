import React, { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";

export const ImageSplitter = ({ imageUrl }: { imageUrl: string }) => {
  const [base64Images, setBase64Images] = useState<string[]>([]);

  const canvasRefs = [
    useRef<HTMLCanvasElement>(null),
    useRef<HTMLCanvasElement>(null),
    useRef<HTMLCanvasElement>(null),
    useRef<HTMLCanvasElement>(null),
  ];
  console.log("imageUrl", imageUrl);
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

  const handleDownload = (base64Image: string, index: number) => {
    const downloadLink = document.createElement("a");
    downloadLink.href = base64Image;
    downloadLink.download = `image_part_${index}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div>
      <img src={imageUrl} alt="Input" className="aspect-square w-96" />
      <div className="grid grid-cols-2">
        {canvasRefs.map((canvasRef, index) => (
          <div key={index}>
            <canvas ref={canvasRef} className="h-[300px] w-[300px]"></canvas>
            {base64Images.length > 0 && (
              <Button
                onClick={() =>
                  handleDownload(base64Images[index] as string, index)
                }
              >
                Download Part {index + 1}
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
