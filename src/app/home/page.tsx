import Image from "next/image";
import PersonalForm from "../globalcomponents/Form-Personal";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-black text-white">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-2xl md:text-1xl text-center mb-6 pixel-font text-yellow-300">
          ¡Bienvenido al Retro Formulario!
        </h1>
        
        <PersonalForm />

        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">
            Completa el formulario y envíalo para conectar con nosotros.
          </li>
          <li>Tu información será manejada de forma segura.</li>
        </ol>
      </main>
      
    </div>
  );
}
