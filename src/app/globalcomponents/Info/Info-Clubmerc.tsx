"use client";
import FormContainer from "../UI/FormContainer";

export default function InfoClubmerc() {
    return (
        <>
        <FormContainer
            overlayClassName="w-full max-w-7xl rounded-tl-[52px] rounded-tr-[52px] rounded-bl-[52px] rounded-br-0 border-[10px] border-black bg-black/65 p-0"
            formClassName="flex flex-col"
        >
        <div className=" bg-opacity-90 p-3 sm:p-4 w-full h-full rounded-tl-[42px] rounded-tr-[42px] rounded-bl-[42px] rounded-br-0">
            <p className="mb-1 text-[10px] sm:text-xs leading-tight font-bold">El Club de Mercadeo es el lugar donde el mercadeo deja de ser teoría y se vuelve vida real. Es una comunidad donde soñamos, planeamos y ejecutamos proyectos grandes, ClubFest y Conamerc. Más allá de los eventos, el Club es un espacio para crecer y aprender ¡No olvides inscribirte en nuestra carpa a las charlas informativas </p>
            
        </div>
        </FormContainer>
        </>
    );
}
