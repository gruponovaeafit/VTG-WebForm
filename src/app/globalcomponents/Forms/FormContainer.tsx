"use client";

import React from "react";

type FormContainerProps = {
  title?: string;
  titleClassName?: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
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
  return (
    <div
      className={`relative w-full flex items-center justify-center ${
        containerClassName ?? ""
      }`}
    >
      <div
        className={
          overlayClassName ??
          "bg-black/70 backdrop-blur-md p-6 rounded-xl shadow-2xl"
        }
      >
        <form
          onSubmit={onSubmit}
          className={
            formClassName ??
            "space-y-4"
          }
        >
        {title && (<h2 className={titleClassName ?? "text-3xl text-center pixel-font text-white mb-6"} >{title}</h2>)}
          
          {children}
          {buttons?.length ? ( <div className="flex gap-3 mt-4">{buttons.map((b, i) => <React.Fragment key={i}>{b}</React.Fragment>)}</div>) : null}

        </form>
      </div>
    </div>
  );
}
