"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import PixelsAnimation from "./globalcomponents/UI/Pixels_animation";

export default function LoadingPage() {
  const router = useRouter();

  const handleRedirect = () => {
    router.push("/email");
  };

  return (
    <div className="flex flex-col justify-between min-h-screen bg-black relative overflow-hidden">
      <div
        className="absolute inset-0 bg-no-repeat bg-center"
        style={{
          backgroundImage: "url('/coins.png')",
          backgroundSize: "cover",
        }}
      ></div>

        <PixelsAnimation />
  
        <div className="relative flex flex-col items-center justify-center flex-grow py-2">
        <button
          onClick={handleRedirect}
          className="w-64 h-32 bg-no-repeat bg-center bg-contain animate-growShrink"
          style={{
            backgroundImage: "url('/START.png')",
          }}
          type="button"
        >
          <span className="sr-only">Start</span>
        </button>

        <footer
          className="absolute bottom-20 flex items-center justify-center"
          style={{ top: 'auto' }}
        >
          <Image
            src="/PoweredByNOVA.svg"
            alt="Powered By NOVA"
            className="w-40 md:w-48"
            width={300}
            height={200}
          />
        </footer>
      </div>
    </div>
  );
}
