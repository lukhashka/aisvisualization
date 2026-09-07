import type { Activation, Weights } from '../../lib/neuron';
import { forward } from '../../lib/neuron';

interface Props {
  w: Weights;
  act: Activation;
  x1: number;
  x2: number;
}

const POS = '#3fb950';
const NEG = '#f0616d';
const ZERO = '#5b6672';

function edgeColor(v: number) {
  if (Math.abs(v) < 0.02) return ZERO;
  return v > 0 ? POS : NEG;
}
function edgeWidth(v: number) {
  return 1.2 + Math.min(Math.abs(v), 3) * 1.5;
}

/** Схема штучного нейрона: входи → ваги → суматор → активація → вихід. */
export function NeuronScheme({ w, act, x1, x2 }: Props) {
  const r = forward(x1, x2, w, act);

  // мініатюра графіка активації всередині блоку
  const curve = Array.from({ length: 60 }, (_, i) => {
    const nx = -3 + (6 * i) / 59;
    const ny = act.f(nx, w.k);
    const [lo, hi] = act.range;
    const px = 372 + ((nx + 3) / 6) * 56;
    const py = 186 - ((ny - lo) / (hi - lo)) * 52;
    return `${px.toFixed(1)},${py.toFixed(1)}`;
  }).join(' ');

  const inputs = [
    { y: 70, label: 'x₁', value: x1, weight: w.w1, wLabel: 'w₁' },
    { y: 160, label: 'x₂', value: x2, weight: w.w2, wLabel: 'w₂' },
    { y: 250, label: '1', value: 1, weight: w.bias, wLabel: 'b' },
  ];

  return (
    <svg viewBox="0 0 580 300" style={{ width: '100%', height: 'auto' }} role="img"
         aria-label="Схема нейрона">
      <defs>
        <marker id="arw" markerWidth="8" markerHeight="8" refX="7" refY="3"
                orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L7,3 L0,6 z" fill="currentColor" />
        </marker>
      </defs>

      {/* зв'язки вхід → суматор */}
      {inputs.map((inp) => (
        <g key={inp.label} style={{ color: edgeColor(inp.weight) }}>
          <line
            x1={92} y1={inp.y} x2={236} y2={160}
            stroke={edgeColor(inp.weight)}
            strokeWidth={edgeWidth(inp.weight)}
            markerEnd="url(#arw)"
          />
          <rect x={132} y={(inp.y + 160) / 2 - 22} width={72} height={19} rx={5}
                fill="#1c232c" stroke="#2a323d" />
          <text x={168} y={(inp.y + 160) / 2 - 8.5} textAnchor="middle"
                fontSize="12" fontFamily="Consolas, monospace"
                fill={edgeColor(inp.weight)}>
            {inp.wLabel} = {inp.weight.toFixed(2)}
          </text>
        </g>
      ))}

      {/* вузли входів */}
      {inputs.map((inp) => (
        <g key={'n' + inp.label}>
          <circle cx={62} cy={inp.y} r={28} fill="#161b22" stroke="#2a323d" strokeWidth="1.5" />
          <text x={62} y={inp.y - 3} textAnchor="middle" fontSize="13" fill="#9aa7b4">
            {inp.label}
          </text>
          <text x={62} y={inp.y + 14} textAnchor="middle" fontSize="14"
                fontFamily="Consolas, monospace" fill="#e6edf3">
            {inp.value}
          </text>
        </g>
      ))}
      <text x={62} y={292} textAnchor="middle" fontSize="10.5" fill="#5b6672">
        зміщення (bias)
      </text>

      {/* суматор */}
      <circle cx={270} cy={160} r={36} fill="#161b22" stroke="#4c9aff" strokeWidth="1.5" />
      <text x={270} y={156} textAnchor="middle" fontSize="20" fill="#4c9aff">Σ</text>
      <text x={270} y={175} textAnchor="middle" fontSize="12"
            fontFamily="Consolas, monospace" fill="#e6edf3">
        {r.net.toFixed(2)}
      </text>
      <text x={270} y={218} textAnchor="middle" fontSize="10.5" fill="#5b6672">
        net = Σ wᵢxᵢ + b
      </text>

      <line x1={308} y1={160} x2={366} y2={160} stroke="#5b6672" strokeWidth="1.6"
            markerEnd="url(#arw)" style={{ color: '#5b6672' }} />

      {/* блок активації */}
      <rect x={368} y={126} width={64} height={68} rx={8}
            fill="#161b22" stroke="#2a323d" strokeWidth="1.5" />
      <line x1={372} y1={160} x2={428} y2={160} stroke="#2a323d" strokeWidth="1" />
      <polyline points={curve} fill="none" stroke="#4c9aff" strokeWidth="1.8" />
      <text x={400} y={214} textAnchor="middle" fontSize="10.5" fill="#5b6672">
        активація f(net)
      </text>

      <line x1={434} y1={160} x2={488} y2={160} stroke="#5b6672" strokeWidth="1.6"
            markerEnd="url(#arw)" style={{ color: '#5b6672' }} />

      {/* вихід */}
      <circle cx={522} cy={160} r={30}
              fill={r.bit ? 'rgba(63,185,80,.14)' : '#161b22'}
              stroke={r.bit ? POS : '#2a323d'} strokeWidth="1.8" />
      <text x={522} y={156} textAnchor="middle" fontSize="11" fill="#9aa7b4">y</text>
      <text x={522} y={174} textAnchor="middle" fontSize="14"
            fontFamily="Consolas, monospace" fill={r.bit ? POS : '#e6edf3'}>
        {r.y.toFixed(2)}
      </text>
      <text x={522} y={214} textAnchor="middle" fontSize="10.5" fill="#5b6672">
        вихід → {r.bit}
      </text>
    </svg>
  );
}
