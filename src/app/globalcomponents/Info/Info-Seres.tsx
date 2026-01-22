"use client";
import FormContainer from "../UI/FormContainer";

export default function InfoSeres() {
    return (
        <>
        <FormContainer
            containerClassName="w-full flex items-center justify-center p-5"
            overlayClassName="w-full max-w-7xl rounded-tl-[52px] rounded-tr-[52px] rounded-bl-[52px] rounded-br-0 border-[10px] border-black bg-black/65 p-0"
            formClassName="flex flex-col"
        >
        <div className=" bg-opacity-90 p-3 sm:p-4 w-full h-full rounded-tl-[42px] rounded-tr-[42px] rounded-bl-[42px] rounded-br-0">
            <h1 className="mb-1 text-xs sm:text-sm text-blue-200 font-semibold">Grupo Seres</h1>
            <p className="mb-1 text-[10px] sm:text-xs leading-tight font-bold">SERES es un espacio para quienes sienten el llamado de servir, liderar y generar impacto real. Aquí no solo ayudas: creces, te retas y te conviertes en la mejor versión de ti mientras transformas vidas. Somos acción, empatía y trabajo en equipo; personas que creen que el cambio empieza cuando alguien decide involucrarse. Si tienes ganas de aportar, aprender y dejar huella, SERES probablemente sea el lugar❤️‍🩹  </p>
            
        </div>
        </FormContainer>
        </>
    );
}
