"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import Footer from "@/app/globalcomponents/UI/Footer";
import RocketAnimation from "./RocketAnimation";

export default function TalkAnimationPage() {
  const [showLogo, setShowLogo] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const router = useRouter();

  useEffect(() => {
    document.body.classList.add("no-scroll");

    const animationTimer = setTimeout(() => setShowLogo(true), 4500);
    const buttonTimer = setTimeout(() => setShowButton(true), 6000);

    return () => {
      document.body.classList.remove("no-scroll");
      clearTimeout(animationTimer);
      clearTimeout(buttonTimer);
    };
  }, []);

  const handleRestart = () => {
    router.push("/");
  };

  return (
    <div className="relative w-full h-screen flex items-center justify-center text-white bg-black bg-stars">
      {/*Rocket*/}
      {!showLogo ? (
        <RocketAnimation />
      ) : (
        <main className="flex flex-col items-center justify-center text-center gap-4 w-full relative z-10 px-4">
          {/*text*/}
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl pixel-font text-yellow-400 glitch"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            YOU WIN!
          </motion.h1>

          {/* TROPHY */}
          <motion.div
            className="flex justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <Image src="/trophy2.png" alt="Trophy" width={150} height={150} priority />
          </motion.div>

          {/*LOGO*/}
          <motion.div
            className="flex flex-col items-center justify-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <Image src="/nova-logo.png" alt="NOVA" width={200} height={80} priority />
            <p className="text-lg sm:text-xl md:text-2xl pixel-font">
              <TypingText text="¡Has superado este nivel!" />
            </p>
          </motion.div>

          {/* BOTÓN RESTART MÁS COMPACTO */}
          {showButton && (
            <motion.button
              onClick={handleRestart}
              className="mt-4 px-6 py-3 text-md sm:text-lg bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-md transition duration-300 shadow-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
            >
              RESTART
            </motion.button>
          )}

          <Footer />
        </main>
      )}
    </div>
  );
}

const TypingText = ({ text }: { text: string }) => {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayText(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(interval);
    }, 100);
    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayText}</span>;
};
