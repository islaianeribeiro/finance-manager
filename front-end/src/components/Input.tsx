import type { ChangeEvent } from "react";

interface InputProps {
  name?: string;
  type?: string;
  value?: string | number;
  checked?: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  label?: string;
  className?: string;
}

export function Input({
  name,
  type = "text",
  value,
  checked,
  onChange,
  placeholder,
  label,
  className,
}: InputProps) {
  return (
    <div className="input-group">
      <input
        name={name}
        type={type}
        {...(type === "checkbox" ? { checked } : { value })}
        onChange={onChange}
        placeholder={placeholder}
        className={className}
      />

      {label && <label className="label">{label}</label>}
    </div>
  );
}
