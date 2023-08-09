import { useState } from "react";
import { Button } from "./ui/button";

interface NameColorsResponse {
  paletteTitle: string;
  colors: colors[];
}

interface colors {
  name: string;
  hex: string;
  rgb: RGB;
  hsl: Hsl;
  lab: Lab;
  luminance: number;
  luminanceWCAG: number;
  requestedHex: string;
  distance: number;
}

interface Hsl {
  h: number;
  s: number;
  l: number;
}

interface Lab {
  l: number;
  a: number;
  b: number;
}

interface RGB {
  r: number;
  g: number;
  b: number;
}

interface TopColor {
  color: string;
  count: number;
  percentage?: number;
  name?: string;
  raw?: RGB;
}

function rgbToHex(rgb: RGB): string {
  const toHex = (num: number) => {
    const hex = num.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  const hexR = toHex(rgb.r);
  const hexG = toHex(rgb.g);
  const hexB = toHex(rgb.b);

  return `${hexR}${hexG}${hexB}`;
}

export const ImageColorAnalyzer = ({
  imageUrl,
  topColorsCount,
}: {
  imageUrl: string;
  topColorsCount: number;
}) => {
  const [topColors, setTopColors] = useState<TopColor[]>([]);

  const getColorNames = async (topColors: TopColor[]) => {
    const hexes = topColors
      .map((colorObj) => {
        const { raw } = colorObj;

        if (!raw) return "";

        return rgbToHex(raw);
      })
      .filter((hex) => hex !== "");

    const res = await fetch(
      `https://api.color.pizza/v1/?values=${hexes.join(",")}&list=bestOf`
    );
    const data = (await res.json()) as NameColorsResponse;

    return data.colors.map((color) => color.name);
  };

  const getTopColorsFromImage = () => {
    const image = new Image();
    image.crossOrigin = "anonymous"; // Enable CORS if needed
    image.src = imageUrl;

    image.onload = async () => {
      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;

      const context = canvas.getContext("2d") as CanvasRenderingContext2D;
      context.drawImage(image, 0, 0);

      const imageData = context.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
      ).data;
      const colorCount: {
        [color: string]: {
          count: number;
          raw?: RGB;
        };
      } = {};

      for (let i = 0; i < imageData.length; i += 4) {
        const r1 = imageData[i] as number;
        const g1 = imageData[i + 1] as number;
        const b1 = imageData[i + 2] as number;

        const r = Math.round(r1 / 50) * 50;
        const g = Math.round(g1 / 50) * 50;
        const b = Math.round(b1 / 50) * 50;
        const color = `rgb(${r},${g},${b})`;

        if (colorCount[color]) {
          const count = colorCount[color]?.count ?? 0;
          colorCount[color] = {
            ...colorCount[color],
            count: count + 1,
          };
        } else {
          colorCount[color] = {
            count: 1,
            raw: { r, g, b },
          };
        }
      }

      const sortedColors = Object.entries(colorCount).sort(
        (a, b) => b[1].count - a[1].count
      );
      const topColors = sortedColors
        .slice(0, topColorsCount)
        .map(([color, { count, raw }]) => ({
          percentage: (count / (imageData.length / 4)) * 100,
          color,
          count,
          raw,
        }));

      const colorNames = await getColorNames(topColors);
      setTopColors(
        topColors.map((colorObj, index) => ({
          ...colorObj,
          name: colorNames[index],
        }))
      );
    };

    image.onerror = (error) => {
      console.error("Error:", error);
    };
  };

  return (
    <div className="text-white">
      <img src={imageUrl} alt="Input" className="aspect-square w-96" />
      <Button onClick={getTopColorsFromImage}>Get Top Colors</Button>
      <h2>Top Colors:</h2>
      <ul>
        {topColors.map((colorObj, index) => (
          <li key={index}>
            <span
              style={{
                backgroundColor: colorObj.color,
                width: "20px",
                height: "20px",
                display: "inline-block",
              }}
            ></span>
            {colorObj.color} - {colorObj.count} - {colorObj.percentage}% -
            {colorObj.name}
          </li>
        ))}
      </ul>
    </div>
  );
};
