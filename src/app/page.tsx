"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import PixelsAnimation from "./globalcomponents/UI/Pixels_animation";

export default function MainPage() {
  const router = useRouter();

  const handleRedirect = () => {
    router.push("/email");
  };

  return (
    <div className="flex flex-col justify-between min-h-screen relative">
      <div
        className="absolute inset-0 bg-no-repeat bg-center"
        style={{
          backgroundImage: "url('/coins.png')",
          backgroundSize: "cover",
        }}
      ></div>

      <div style={{ pointerEvents: "none" }}>
        <PixelsAnimation />
      </div>
  
        <div className="relative flex flex-col items-center justify-center flex-grow py-2">
        <button
          onClick={handleRedirect}
          className="w-64 h-32 bg-center bg-contain animate-growShrink"
          style={{
            backgroundImage: "url('/START.png')",
          }}
          type="button">
        </button>

        <footer
          className="absolute bottom-20 flex items-center justify-center" // CHECK
          style={{ top: 'auto' }}
        >
          <Image
            src="/PoweredByNOVA.svg"
            alt="Powered By NOVA"
            className="w-40 md:w-48"
            width={300}
            height={300}
          />
        </footer>
      </div>
    </div>
  );
}
