interface Option {
  label: string;
  value: string;
  disabled?: boolean;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  label?: string;
}

export function Select({ value, onChange, options, label }: SelectProps) {
  return (
    <>
      {label && <label className="label">{label}</label>}
      <select
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} disabled={opt.disabled}>
            {opt.label}
          </option>
        ))}
      </select>
    </>
  );
}
