"use client";

import { motion } from "framer-motion";
import Link from "next/link";

type ButtonVariant = "primary" | "secondary" | "success";

interface PixelButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  href?: string;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-soft-gold text-warm-white hover:bg-soft-gold-light border-soft-gold/30",
  secondary:
    "bg-forest text-warm-white hover:bg-forest-light border-forest/30",
  success:
    "bg-sage text-warm-white hover:bg-sage-light border-sage/30",
};

const sizeStyles = {
  sm: "px-4 py-2.5 text-xs min-h-[44px]",
  md: "px-6 py-3 text-sm min-h-[44px]",
  lg: "px-10 py-4 text-base min-h-[44px]",
};

export default function PixelButton({
  children,
  variant = "primary",
  href,
  onClick,
  size = "md",
  className = "",
  disabled = false,
  fullWidth = false,
}: PixelButtonProps) {
  const baseStyles = `
    inline-flex items-center justify-center
    font-[family-name:var(--font-quicksand)]
    font-semibold tracking-wide
    border rounded-full cursor-pointer
    transition-all duration-300
    select-none
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${fullWidth ? "w-full" : ""}
    ${disabled ? "opacity-50 cursor-not-allowed" : ""}
    ${className}
  `;

  const buttonContent = (
    <motion.span
      className={baseStyles}
      whileHover={
        disabled
          ? {}
          : {
              y: -2,
              boxShadow: "0 8px 25px rgba(29, 68, 32, 0.15)",
            }
      }
      whileTap={
        disabled
          ? {}
          : {
              y: 1,
              boxShadow: "0 2px 8px rgba(29, 68, 32, 0.1)",
            }
      }
      style={{
        boxShadow: "0 4px 15px rgba(29, 68, 32, 0.1)",
      }}
    >
      {children}
    </motion.span>
  );

  if (href && !disabled) {
    return <Link href={href}>{buttonContent}</Link>;
  }

  return (
    <button onClick={disabled ? undefined : onClick} disabled={disabled}>
      {buttonContent}
    </button>
  );
}
