import type { ReactNode, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  icon?: ReactNode;
  variant?: "primary" | "danger" | "ghost";
}

export function Button({
  children,
  icon,
  variant = "primary",
  className = "",
  ...rest
}: ButtonProps) {
  return (
    <button className={`btn ${variant} ${className}`} {...rest}>
      {icon && <span className="btn-icon">{icon}</span>}
      {children && <span className="btn-text">{children}</span>}
    </button>
  );
}
