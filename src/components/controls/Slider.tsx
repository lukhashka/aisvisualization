interface Props {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  hint?: string;
  digits?: number;
}

export function Slider({
  label, value, onChange, min = -3, max = 3, step = 0.1, hint, digits = 2,
}: Props) {
  return (
    <div className="control">
      <div className="control__head">
        <span className="control__label">{label}</span>
        <span className="control__value">{value.toFixed(digits)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      {hint && <div className="control__hint">{hint}</div>}
    </div>
  );
}
