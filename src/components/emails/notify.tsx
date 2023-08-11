import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Tailwind,
  Text,
} from "@react-email/components";
import { env } from "~/env.mjs";

interface NotifyEmailProps {
  images: string[];
}

const imageUrl = `${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/optimized`;

export const NotifyEmail = ({ images }: NotifyEmailProps) => {
  const previewText = `WITAS ${images.length} sticker${
    images.length > 1 ? "s" : ""
  } generated`;

  const imagesGrouped = images.reduce<string[][]>(
    (acc, image, index) => {
      const groupIndex = Math.floor(index / 2);

      if (!acc[groupIndex]) {
        acc[groupIndex] = [];
      }

      acc[groupIndex]?.push(image);

      return acc;
    },
    [[]]
  );

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-[40px] w-full max-w-[600px] rounded border border-solid border-[#eaeaea] p-[20px]">
            <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
              Here are your optimized <strong>{images.length}</strong> sticker
              {images.length > 1 ? "s" : ""}
            </Heading>
            <Text className="text-[14px] leading-[24px] text-black">
              Hello,
              <br />
              <br />
              We&apos;ve optimized your chosen stickers and here are the
              results.
              <br />
              <br />
              P.S. They&apos;ve been upscaled to ~4k and had their background
              removed.
            </Text>
            {imagesGrouped.map((images, i) => (
              <Row key={i} className="mb-[20px]" align="center">
                {images.map((image, index) => (
                  <Column
                    key={index}
                    align="center"
                    style={{
                      width: "50%",
                      padding: "0 10px",
                    }}
                  >
                    <Img
                      className="mx-auto my-[32px] w-[200px] rounded border border-solid border-[#eaeaea]"
                      src={`${imageUrl}/${image}`}
                      alt="Sticker"
                    />
                    <Link
                      href={`${imageUrl}/${image}`}
                      className="mt-[12px] rounded bg-black px-3 py-1.5 text-center text-[14px] leading-[24px] text-white "
                    >
                      Download sticker
                    </Link>
                  </Column>
                ))}
              </Row>
            ))}
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
