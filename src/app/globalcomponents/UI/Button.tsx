"use client";

import React from "react";
import Image from "next/image";

type ButtonTheme = "default" | "fifa" | "china";
type ButtonVariant = "amarillo" | "azul" | "rojo" | "naranja" | "verde";
type ButtonSize = "sm" | "md" | "lg";
type ButtonState = "active" | "disabled" | "loading";
type ButtonType = "button" | "submit" | "reset";

type ButtonProps = {
  children: React.ReactNode;

  theme?: ButtonTheme;
  variant?: ButtonVariant;
  size?: ButtonSize;
  state?: ButtonState;
  type?: ButtonType;

  spinOnClick?: boolean;
  disabled?: boolean;

  show?: boolean;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  
  // Controla si se muestra la sombra del texto (solo para tema 'fifa')
  textShadow?: boolean;
};

type ThemeConfig = {
  base: string;
  variants: Record<ButtonVariant, string>;
  sizes: Record<ButtonSize, string>;
};

const themes: Record<ButtonTheme, ThemeConfig> = {
  default: {
    base:
      "w-full rounded font-bold uppercase tracking-wider transition duration-300 transform",
    variants: {
      amarillo:
        "bg-yellow-400 text-black hover:bg-yellow-500 active:bg-yellow-600",
      azul: "bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700",
      rojo: "bg-red-500 text-white hover:bg-red-600 active:bg-red-700",
      naranja:
        "bg-orange-400 text-black hover:bg-orange-500 active:bg-orange-600",
      verde: "bg-green-400 text-white hover:bg-green-500 active:bg-green-600",
    },
    sizes: {
      sm: "py-2 px-3 text-sm",
      md: "py-3 px-4 text-base",
      lg: "py-4 px-6 text-lg",
    },
  },

  fifa: {
    base: `
      font-ea
      group
      relative w-full
      pl-4 pr-14 sm:pl-6 sm:pr-16 md:pl-8 md:pr-20
      rounded-tr-full
      rounded-br-full
      rounded-bl-full
      rounded-tl-sm

      flex items-center justify-center
      overflow-visible
      uppercase tracking-wide
      text-3xl sm:text-4xl md:text-5xl
      transition
      active:translate-y-1
    `,
    variants: {
      verde: `
        bg-[#34C759] text-white
        shadow-[0_10px_0_rgba(0,0,0,0.35)] sm:shadow-[0_12px_0_rgba(0,0,0,0.35)] md:shadow-[0_14px_0_rgba(0,0,0,0.35)]
        hover:bg-[#2FB650]
        active:shadow-[0_6px_0_rgba(0,0,0,0.35)]
      `,
      amarillo:
        "bg-yellow-400 text-black hover:bg-yellow-500 active:bg-yellow-600",
      azul: "bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700",
      rojo: "bg-red-500 text-white hover:bg-red-600 active:bg-red-700",
      naranja:
        "bg-orange-400 text-black hover:bg-orange-500 active:bg-orange-600",
    },
    sizes: {
      sm: "h-[48px] sm:h-[52px]",
      md: "h-[50px] sm:h-[64px] md:h-[72px]",
      lg: "h-[64px] sm:h-[76px] md:h-[88px]",
    },
  },

  china: {
    base: `
      font-press
      w-full rounded-xl px-6 py-3
      font-bold tracking-wide
      border-2
      transition
    `,
    variants: {
      amarillo:
        "bg-yellow-200 text-red-700 border-red-600 hover:bg-yellow-300",
      azul: "bg-blue-200 text-red-700 border-red-600 hover:bg-blue-300",
      rojo: "bg-red-600 text-yellow-200 border-yellow-300 hover:bg-red-700",
      naranja:
        "bg-orange-300 text-red-700 border-red-600 hover:bg-orange-400",
      verde:
        "bg-green-600 text-yellow-200 border-yellow-300 hover:bg-green-700",
    },
    sizes: {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
    },
  },
};

export default function Button({
  children,
  theme = "default",
  variant = "amarillo",
  size = "md",
  state = "active",
  type = "button",
  spinOnClick = true,
  disabled = false,
  show = true,
  className = "",
  onClick,
  textShadow = true,
}: ButtonProps) {
  const [isSpinning, setIsSpinning] = React.useState(false);
  const spinTimerRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    return () => {
      if (spinTimerRef.current) {
        window.clearTimeout(spinTimerRef.current);
      }
    };
  }, []);

  if (!show) return null;

  const isDisabled = state === "disabled" || state === "loading" || disabled;
  const t = themes[theme];

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    if (spinOnClick && theme === "fifa") {
      // reinicia cualquier timer previo y gira durante 1s
      if (spinTimerRef.current) {
        window.clearTimeout(spinTimerRef.current);
      }
      setIsSpinning(true);
      spinTimerRef.current = window.setTimeout(() => {
        setIsSpinning(false);
        spinTimerRef.current = null;
      }, 900);
    }
    onClick?.(e);
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={isDisabled}
      aria-busy={state === "loading"}
      className={[
        t.base,
        t.variants[variant],
        t.sizes[size],
        isDisabled
          ? "opacity-60 cursor-not-allowed transform-none"
          : "hover:scale-105 active:scale-95",
        className,
      ].join(" ")}
    >
      {/* TEXTO */}
      <span
        style={{
          textShadow:
            theme === "fifa" && textShadow
              ? "0 6px 0 rgba(0,80,35,0.9), 0 12px 18px rgba(0,0,0,0.35)"
              : undefined,
        }}
      >
        {children}
      </span>

      {/* BALÓN FIFA — PARTE DEL DISEÑO */}
      {theme === "fifa" && (
        <span
          className="
            absolute right-[-20px] sm:right-[-28px] md:right-[-32px] top-1/2 -translate-y-1/2
            w-20 h-18 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full
            overflow-hidden pointer-events-none
          "
        >
          <Image
            src="/FifaBall.png"
            alt=""
            width={64}
            height={64}
            className={[
              "w-full h-full object-cover",
              state === "loading" || isSpinning
                ? "animate-[spin_0.8s_linear_infinite]"
                : "",
            ].join(" ")}
            priority
          />
        </span>
      )}
    </button>
  );
}
