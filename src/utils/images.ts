import imageCompression from "browser-image-compression";

export const urlToBase64 = async (url: string) => {
  const data = await fetch(url);
  const blob = await data.blob();

  return new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const base64data = reader.result as string;
      resolve(base64data);
    };
  });
};

export const urltoFile = (url: string, filename: string, mimeType: string) => {
  return fetch(url)
    .then(function (res) {
      return res.arrayBuffer();
    })
    .then(function (buf) {
      return new File([buf], filename, { type: mimeType });
    });
};

export const fileToBase64 = async (file: File) => {
  return new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const base64data = reader.result as string;
      resolve(base64data);
    };
  });
};

export const compressImage = async (image: File) => {
  const options = {
    maxSizeMB: 0.25,
    maxWidthOrHeight: 1024,
    useWebWorker: true,
  };
  try {
    const compressedImage = (await imageCompression(image, options)) as File;
    console.log(
      "compressedFile instanceof Blob",
      compressedImage instanceof Blob
    ); // true
    console.log(`compressedFile size ${compressedImage.size / 1024 / 1024} MB`); // smaller than maxSizeMB
    return compressedImage;
  } catch (error) {
    console.log(error);
  }

  return image;
};
