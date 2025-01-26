"use client";
import Image from "next/image";

export default function Footer() {
    return (
      <footer className="flex items-center justify-center py-4 relative z-10">
        <img
          src="/PoweredByNOVA.svg"
          alt="Powered By NOVA"
          className="w-32 md:w-48"
        />
      </footer>
    );
  }
  
