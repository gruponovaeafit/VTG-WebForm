"use client";

import { useRouter } from "next/navigation";

export default function InfoUn() {

    const router = useRouter();

    const handleNextClick = () => {
      router.push("/groups/unsociety/info/"); // Asegúrate de que esta sea la ruta correcta para tu formulario de SPIE
    };

    return (
        <div className="bg-gray-800 bg-opacity-90 p-6 rounded-lg shadow-lg max-w-md w-full">
            <h1 className="mb-2 text-blue-400">UN Society, impactando realidades.</h1>
            <p className="mb-2 text-[11px]"> Somos un espacio que te ayudará a potenciar tus habilidades de todo tipo, desde la oratoría y el debate hasta la comunicación asertiva y la obtención de resultados. No somos solo delegados, somos seres humanos integros con habilidades diversas en redes, logística, relaciones públicas, gestión humana y academía ¡Únete a nosotros e impacta al grupo con tus habilidades! </p>
            <h1 className="mb-2 text-blue-400">ASSESSMENT 2025-1</h1>
            <p className="text-[12px] text-white">¡Te esperamos en nuestro Assessment el 1 de Febrero!</p>    
        
        <button
            type="button"
            onClick={handleNextClick} // Función para manejar el clic
            className="w-full mt-4 py-2 px-4 bg-yellow-400 text-black rounded shadow hover:bg-yellow-500 active:bg-yellow-600 font-bold uppercase tracking-wider transition duration-300"
        >
            Siguiente
        </button>
        
        </div>

    );
}
