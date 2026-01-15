"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import FormContainer from "../UI/FormContainer";

export default function InfoSPIE() {
  const router = useRouter();

  const handleNextClick = () => {
    router.push("/groups/spie/form/");
  };

  return (
    <div className="relative flex min-h-[100dvh] items-center justify-center px-4 overflow-hidden">
      {/* 🔵 FORMA ARRIBA IZQUIERDA */}
      <Image
        src="/forma-spie1.png"
        alt=""
        width={300}
        height={300}
        className="absolute top-0 left-0 z-0 pointer-events-none select-none"
      />

      {/* 🔵 FORMA ABAJO DERECHA */}
      <Image
        src="/forma-spie2.png"
        alt=""
        width={300}
        height={300}
        className="absolute bottom-0 right-0 z-0 pointer-events-none select-none"
      />

      {/* CONTENIDO */}
      <div className="relative z-10 flex flex-col items-center">
        {/* LOGO */}
        <div className="mb-2 md:mb-4">
          <Image
            src="/spie-logo.png"
            alt="SPIE Logo"
            width={130}
            height={130}
            className="md:w-[180px]"
            priority
          />
        </div>


        {/* FORM / INFO */}
        <FormContainer
          formClassName="space-y-4"
          buttons={[
            <button
              key="next"
              type="button"
              onClick={handleNextClick}
              className="w-full py-2 px-4 bg-yellow-400 text-black rounded shadow hover:bg-yellow-500 active:bg-yellow-600 font-bold uppercase tracking-wider transition duration-300"
            >
              Siguiente
            </button>,
          ]}
        >
          <div className="bg-gray-800 bg-opacity-90 p-3 rounded-lg shadow-lg max-w-md w-full">
            <h1 className="mb-4 text-red-600 font-bold text-lg">Comités</h1>

            <p className="text-[10px] mb-1">
              <span className="font-bold text-red-600">
                Comité de publicidad:
              </span>{" "}
              Crea, gestiona y planifica la publicidad (física y digital) del
              capítulo SPIE.
            </p>

            <p className="text-[10px] mb-1">
              <span className="font-bold text-red-600">
                Comité de divulgación:
              </span>{" "}
              Planea y ejecuta actividades de divulgación científica y
              experimentos creativos en la universidad y otros espacios.
            </p>

            <p className="text-[10px] mb-1">
              <span className="font-bold text-red-600">Comité de RRPP:</span>{" "}
              Gestiona la imagen del grupo y establece vínculos con la comunidad
              y diferentes patrocinadores para mayor visibilidad.
            </p>

            <p className="text-[10px] mb-1">
              <span className="font-bold text-red-600">Comité de GH:</span>{" "}
              Genera un ambiente seguro y acogedor para los miembros mediante
              diversas actividades de integración.
            </p>
          </div>
        </FormContainer>
      </div>
    </div>
  );
}
