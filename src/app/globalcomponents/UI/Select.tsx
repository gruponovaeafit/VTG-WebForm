"use client";

//Componente reutilizable de Select con soporte para errores y textos de ayuda
import React from "react";

// Definición de tipos para las opciones y las props del componente Select
type Option = {
  label: string;
  value: string;
};

type ColorTheme =
  | "blue"
  | "pink"
  | "purple"
  | "green"
  | "yellow"
  | "red"
  | "indigo"
  | "cyan"
  | "orange"
  | "teal";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  id: string;
  name: string;
  label?: string;
  options: Option[];
  defaultValue?: string | number;
  error?: boolean;
  errorMessage?: string;
  helperText?: string;
  colorTheme?: ColorTheme;
  borderColorClass?: string;
  focusRingColorClass?: string;
  labelColorClass?: string;
  containerClassName?: string;
};

const colorThemes: Record<
  ColorTheme,
  { border: string; focusRing: string; label: string }
> = {
  blue: {
    border: "border-blue-400",
    focusRing: "focus:ring-blue-500",
    label: "text-blue-400",
  },
  pink: {
    border: "border-pink-400",
    focusRing: "focus:ring-pink-500",
    label: "text-pink-400",
  },
  purple: {
    border: "border-purple-600",
    focusRing: "focus:ring-purple-700",
    label: "text-purple-600",
  },
  green: {
    border: "border-green-400",
    focusRing: "focus:ring-green-500",
    label: "text-green-400",
  },
  yellow: {
    border: "border-yellow-400",
    focusRing: "focus:ring-yellow-500",
    label: "text-yellow-400",
  },
  red: {
    border: "border-red-400",
    focusRing: "focus:ring-red-500",
    label: "text-red-400",
  },
  indigo: {
    border: "border-indigo-400",
    focusRing: "focus:ring-indigo-500",
    label: "text-indigo-400",
  },
  cyan: {
    border: "border-cyan-400",
    focusRing: "focus:ring-cyan-500",
    label: "text-cyan-400",
  },
  orange: {
    border: "border-orange-400",
    focusRing: "focus:ring-orange-500",
    label: "text-orange-400",
  },
  teal: {
    border: "border-teal-400",
    focusRing: "focus:ring-teal-500",
    label: "text-teal-400",
  },
};

//Componente Select
export default function Select({
  id,
  name,
  label,
  options,
  defaultValue,
  disabled,
  error = false,
  errorMessage,
  helperText,
  className = "",
  containerClassName = "",
  colorTheme = "blue",
  borderColorClass,
  focusRingColorClass,
  labelColorClass,
  ...rest
}: SelectProps) {
  const theme = colorThemes[colorTheme];

  const borderClass = error
    ? "border-red-600"
    : borderColorClass || "border-black focus:border-white";

  const focusRingClass = error
    ? "focus:ring-red-500"
    : focusRingColorClass || "focus:ring-white";

  const labelColor =
    error ? "text-red-200" : labelColorClass || theme.label;

  const baseLabelClasses = "block text-left text-lg font-extrabold mb-2 " + "drop-shadow-[0_2px_0_rgba(0,0,0,0.7)]";

  const baseSelectClasses =
    "w-full rounded-tl-[16px] rounded-tr-[16px] rounded-bl-[16px] rounded-br-0 border-[3px] bg-[#f2dc4b] " +
    "px-4 py-2.5 text-base text-[#2b2b2b] font-semibold " +
    "focus:outline-none focus:ring-2 " +
    "disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className={containerClassName || "mb-4"}>
      {label && (
        <label
          htmlFor={id}
          className={`${baseLabelClasses} ${labelColor}`}
        >
          {label}
        </label>
      )}

      <select
        id={id}
        name={name}
        defaultValue={defaultValue}
        disabled={disabled}
        className={`${baseSelectClasses} ${borderClass} ${focusRingClass} ${className}`}
        aria-invalid={error}
        aria-describedby={
          error && errorMessage
            ? `${id}-error`
            : helperText
            ? `${id}-helper`
            : undefined
        }
        {...rest}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {error && errorMessage && (
        <p id={`${id}-error`} className="mt-1 text-xs text-red-400" role="alert">
          {errorMessage}
        </p>
      )}

      {!error && helperText && (
        <p id={`${id}-helper`} className="mt-1 text-xs text-purple-300">
          {helperText}
        </p>
      )}
    </div>
  );
}