"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function RocketAnimation() {
  const [showRocket, setShowRocket] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowRocket(false), 2500); 
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center z-10">
      {showRocket && ( 
        <motion.div
          className="absolute inset-0 w-full h-full flex justify-center items-center"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1, delay: 1}}
        >
          <Image
            src="https://novaeafit.blob.core.windows.net/vtg-2025-1/rocket.gif"
            alt="Cohete despegando"
            fill={true} 
            className="object-cover"
            priority
          />
        </motion.div>
      )}
    </div>
  );
}
