"use client";

import React from "react";

type ButtonVariant = "amarillo" | "azul" | "rojo" | "naranja";
type ButtonSize = "sm" | "md" | "lg";
type ButtonState = "active" | "disabled" | "loading";
type ButtonType = "button" | "submit" | "reset";

type ButtonProps = {
  children: React.ReactNode;

  color?: ButtonVariant;
  size?: ButtonSize;
  state?: ButtonState;
  type?: ButtonType;

  show?: boolean;

  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

const base =
  "w-full rounded font-bold uppercase tracking-wider transition duration-300 transform";

const colorClasses: Record<ButtonVariant, string> = {
  amarillo: "bg-yellow-400 text-black hover:bg-yellow-500 active:bg-yellow-600",
  azul: "bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700",
  rojo: "bg-red-500 text-white hover:bg-red-600 active:bg-red-700",
  naranja: "bg-orange-400 text-black hover:bg-orange-500 active:bg-orange-600",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "py-2 px-3 text-sm",
  md: "py-3 px-4 text-base",
  lg: "py-4 px-6 text-lg",
};

export default function Button({
  children,
  color = "amarillo",
  size = "md",
  state = "active",
  type = "button",
  show = true,
  className = "",
  onClick,
}: ButtonProps) {

  if (!show) return null;

  
  const isDisabled = state === "disabled" || state === "loading";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      aria-busy={state === "loading"}
      className={[
        base,
        colorClasses[color],
        sizeClasses[size],
        isDisabled
          ? "opacity-60 cursor-not-allowed transform-none"
          : "hover:scale-105 active:scale-95",
        className,
      ].join(" ")}
    >
      {children}
    </button>
  );
}
