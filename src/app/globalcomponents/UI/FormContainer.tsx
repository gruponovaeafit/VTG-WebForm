"use client";

import React from "react";

type FormContainerProps = {
  title?: string;
  titleClassName?: string;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  children: React.ReactNode;

  // overrides
  containerClassName?: string;
  overlayClassName?: string;
  formClassName?: string;
  buttons?: React.ReactNode[];
};

export default function FormContainer({
  title,
  titleClassName,
  onSubmit,
  children,
  containerClassName,
  overlayClassName,
  formClassName,
  buttons,
}: FormContainerProps) {
  // Contenedor: centra el "formComponent"
  const defaultContainerClassName =
    "w-full flex items-center justify-center p-6";
  // Rectángulo con borde negro (la "tarjeta")
  // Esquinas redondeadas excepto la inferior derecha (punteaguda)
  const defaultOverlayClassName =
    "w-full max-w-[420px] rounded-tl-[52px] rounded-tr-[52px] rounded-bl-[52px] rounded-br-0 border-[10px] border-black bg-black/65 p-4 sm:p-6";
  // Layout del form
  const defaultFormClassName = "flex flex-col gap-3 sm:gap-4 items-center text-center";
  // Título estilo “pixel” (si lo usas)
  const defaultTitleClassName = "text-4xl font-extrabold text-white drop-shadow-[0_4px_0_rgba(0,0,0,0.65)]";

  return (
    <div className={containerClassName ?? defaultContainerClassName}>
      <div className={overlayClassName ?? defaultOverlayClassName}>
        <form
          onSubmit={onSubmit}
          className={formClassName ?? defaultFormClassName}
        >
          {title && (
            <h2 className={titleClassName ?? defaultTitleClassName}>{title}</h2>
          )}

          {children}

          {buttons && buttons.length > 0 && (
            <div className="mt-2 flex justify-center">
              <div className="flex items-center gap-4">{buttons}</div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
