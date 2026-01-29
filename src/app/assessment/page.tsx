"use client";

import AssessmentForm from "../globalcomponents/Forms/Form-Assessment";
import ConfettiAnimation from "@/app/globalcomponents/UI/LazyConfetti";
import Footer_NOVA_blanco from "../globalcomponents/UI/Footer_NOVA_blanco";
import { useEffect } from "react";
import { useAuthCheck } from "@/app/hooks/useAuthCheck";

export default function Home() {
  const isVerified = useAuthCheck();

  useEffect(() => {
    document.body.classList.add("no-scroll");
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, []);

  if (!isVerified) return null;

  return (
    <div
      className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-[#594EB7] text-black"
      style={{
        position: "relative",
        overflow: "hidden",
      }}
    >
      <img
        src="/NOVA_ManchaTop.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none select-none absolute left-0 top-0 z-0 w-[220px] h-auto
         sm:w-[760px] 
         md:w-[600px]"
      />
      <img
        src="/NOVA_ManchaBottom.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none select-none absolute bottom-0 right-0 z-0 w-[280px] h-auto
        sm:w-[620px]
        md:w-[700px]"
      />

      <div className="pointer-events-none absolute inset-0 z-[1]">
        <ConfettiAnimation />
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-full max-w-[500px] px-4 flex flex-col items-center text-center">
        <div className="flex flex-col gap-0 mb-4">
          <h1 className="text-3xl font-ea text-white">Assessment</h1>
          <h2 className="text-5xl font-ea text-white">NOVA</h2>
        </div>

        <div className="-mt-3 sm:-mt-5 w-full flex justify-center">
          <AssessmentForm />
        </div>

        <div className="flex justify-center w-full mt-8 sm:mt-0 md:mt-20">
          <Footer_NOVA_blanco />
        </div>
      </div>
      
    </div>
  );
}
