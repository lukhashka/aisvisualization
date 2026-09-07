import type { Activation, LogicFn, Weights } from '../../lib/neuron';
import { INPUTS, forward } from '../../lib/neuron';

interface Props {
  w: Weights;
  act: Activation;
  fn: LogicFn;
  selected: number;
  onSelect: (i: number) => void;
}

export function TruthTable({ w, act, fn, selected, onSelect }: Props) {
  const rows = INPUTS.map(([x1, x2], i) => {
    const r = forward(x1, x2, w, act);
    return { x1, x2, ...r, target: fn.targets[i], ok: r.bit === fn.targets[i] };
  });
  const correct = rows.filter((r) => r.ok).length;

  return (
    <>
      <table className="ttable">
        <thead>
          <tr>
            <th>x₁</th>
            <th>x₂</th>
            <th>net</th>
            <th>y = f(net)</th>
            <th>вихід</th>
            <th>очікувано</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr
              key={i}
              className={i === selected ? 'is-selected' : ''}
              onClick={() => onSelect(i)}
              title="Показати цей набір входів на схемі"
            >
              <td className="num">{r.x1}</td>
              <td className="num">{r.x2}</td>
              <td className="num">{r.net.toFixed(2)}</td>
              <td className="num">{r.y.toFixed(3)}</td>
              <td className="num" style={{ color: '#e6edf3' }}>{r.bit}</td>
              <td className="num">{r.target}</td>
              <td className={r.ok ? 'ok' : 'bad'}>{r.ok ? '✓' : '✗'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p style={{ marginTop: 12 }}>
        <span className={'badge ' + (correct === 4 ? 'badge--ok' : 'badge--bad')}>
          {correct === 4
            ? `Функцію ${fn.label} реалізовано правильно (4 з 4)`
            : `Правильно ${correct} з 4 наборів`}
        </span>
      </p>
    </>
  );
}
