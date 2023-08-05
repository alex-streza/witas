import Image from "next/image";
import { env } from "~/env.mjs";

export default function Page({ params }: { params: { id: string } }) {
  return (
    <div>
      <Image
        src={`${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/stickers/${params.id}.png`}
        alt=""
        width={512}
        height={512}
      />
    </div>
  );
}
