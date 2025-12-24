"use client";

import React from "react";

type FormContainerProps = {
  title?: string;
  titleClassName?: string;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  children: React.ReactNode;
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
  const defaultOverlayClassName = "";
  const defaultFormClassName = "space-y-4";
  const defaultTitleClassName = "text-3xl text-center pixel-font text-white mb-6";

  return (
    <div
      className={`relative w-full flex items-center justify-center ${
        containerClassName ?? ""
      }`}
    >
      <div className={overlayClassName ?? defaultOverlayClassName}>
        <form onSubmit={onSubmit} className={formClassName ?? defaultFormClassName}>
          {title && (
            <h2 className={titleClassName ?? defaultTitleClassName}>
              {title}
            </h2>
          )}

          {children}

          {buttons && buttons.length > 0 && (
            <div className="flex gap-3 mt-4">
              {buttons.map((button, index) => (
                <React.Fragment key={index}>{button}</React.Fragment>
              ))}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
