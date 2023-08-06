import type { MJMessage } from "midjourney";

const streamFetch = async (
  url: string,
  body: string,
  loading?: (uri: MJMessage) => void
) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body,
  });
  const reader = response.body?.getReader();
  let buffer = "";
  if (reader) {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      buffer += new TextDecoder("utf-8").decode(value);

      let startIdx = 0;
      let endIdx = buffer.indexOf("}");
      while (endIdx !== -1) {
        const jsonString = buffer.substring(startIdx, endIdx + 1);
        try {
          const parsedMessage = JSON.parse(jsonString) as MJMessage;
          loading && loading(parsedMessage);
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
        startIdx = endIdx + 1;
        endIdx = buffer.indexOf("}", startIdx);
      }
      buffer = buffer.slice(startIdx);
    }
  } else {
    console.log("Response body is null");
  }
};

export const Imagine = (body: string, loading?: (uri: MJMessage) => void) => {
  return streamFetch("api/imagine/", body, loading);
};
