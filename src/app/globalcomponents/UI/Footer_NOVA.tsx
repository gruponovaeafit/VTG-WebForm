"use client";
import Image from "next/image";

export default function Footer() {
    return (
      <footer className="flex items-center justify-center py-4 relative z-10">
        <Image
          src="https://novaeafit.blob.core.windows.net/vtg-2025-1/PoweredByLOVE.svg"
          alt="Powered By NOVA"
          className="w-32 md:w-48"
          width={192} // Equivalent to w-32
          height={96} // Equivalent to h-16
        />
      </footer>
    );
  }
  
