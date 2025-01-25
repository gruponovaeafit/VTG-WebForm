"use client";
import Image from "next/image";

export default function Footer (){
    return(
        <footer className="relative z-10 flex items-center justify-center py-2 ">
            <Image
                src="/PoweredByNOVA.svg"
                alt="Powered By NOVA"
                className="w-40 md:w-48"
                width={300}
                height={200}
            />
        </footer>
    )
}