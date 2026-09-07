interface Option<T> { value: T; label: string; title?: string }

interface Props<T extends string> {
  label?: string;
  value: T;
  options: Option<T>[];
  onChange: (v: T) => void;
}

export function ButtonGroup<T extends string>({ label, value, options, onChange }: Props<T>) {
  return (
    <div className="control">
      {label && (
        <div className="control__head">
          <span className="control__label">{label}</span>
        </div>
      )}
      <div className="btn-group">
        {options.map((o) => (
          <button
            key={o.value}
            title={o.title}
            className={'btn' + (o.value === value ? ' btn--active' : '')}
            onClick={() => onChange(o.value)}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
