import { useEffect, useRef } from 'react';
import type { Activation, LogicFn, Weights } from '../../lib/neuron';
import { INPUTS, forward } from '../../lib/neuron';

interface Props {
  w: Weights;
  act: Activation;
  fn: LogicFn;
  selected: number;
}

const PAD = 40;
const SIZE = 400;          // сторона поля побудови, px
const LO = -0.6, HI = 1.6; // діапазон осей

const toPx = (v: number) => PAD + ((v - LO) / (HI - LO)) * SIZE;
const toPy = (v: number) => PAD + SIZE - ((v - LO) / (HI - LO)) * SIZE;

/** Площина входів (x₁, x₂) з розділювальною прямою w₁x₁ + w₂x₂ + b = 0. */
export function DecisionPlane({ w, act, fn, selected }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    const W = PAD * 2 + SIZE;
    // рендеримо в подвійній щільності, щоб підписи не милились на HiDPI
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = W * dpr;
    cv.height = W * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, W);

    // заливка: колір за значенням виходу нейрона
    const step = 2;
    const [lo, hi] = act.range;
    for (let px = 0; px < SIZE; px += step) {
      for (let py = 0; py < SIZE; py += step) {
        const x1 = LO + (px / SIZE) * (HI - LO);
        const x2 = HI - (py / SIZE) * (HI - LO);
        const y = act.f(w.w1 * x1 + w.w2 * x2 + w.bias, w.k);
        const t = Math.min(1, Math.max(0, (y - lo) / (hi - lo)));
        const R = Math.round(76 + (63 - 76) * t);
        const G = Math.round(154 + (185 - 154) * t);
        const B = Math.round(255 + (80 - 255) * t);
        ctx.fillStyle = `rgba(${R},${G},${B},${0.16 + 0.3 * t})`;
        ctx.fillRect(PAD + px, PAD + py, step, step);
      }
    }

    // рамка та сітка
    ctx.strokeStyle = '#2a323d';
    ctx.lineWidth = 1;
    ctx.strokeRect(PAD, PAD, SIZE, SIZE);
    ctx.fillStyle = '#9aa7b4';
    ctx.font = '11px Consolas, monospace';
    for (const v of [0, 1]) {
      ctx.setLineDash([3, 4]);
      ctx.beginPath();
      ctx.moveTo(toPx(v), PAD); ctx.lineTo(toPx(v), PAD + SIZE);
      ctx.moveTo(PAD, toPy(v)); ctx.lineTo(PAD + SIZE, toPy(v));
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillText(String(v), toPx(v) - 3, PAD + SIZE + 16);
      ctx.fillText(String(v), PAD - 16, toPy(v) + 4);
    }
    ctx.fillText('x₁', PAD + SIZE / 2, PAD + SIZE + 32);
    ctx.save();
    ctx.translate(12, PAD + SIZE / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('x₂', 0, 0);
    ctx.restore();

    // розділювальна пряма w1·x1 + w2·x2 + b = 0
    ctx.strokeStyle = '#e6edf3';
    ctx.lineWidth = 2;
    ctx.beginPath();
    if (Math.abs(w.w2) > 1e-6) {
      const y1 = -(w.w1 * LO + w.bias) / w.w2;
      const y2 = -(w.w1 * HI + w.bias) / w.w2;
      ctx.moveTo(toPx(LO), toPy(y1));
      ctx.lineTo(toPx(HI), toPy(y2));
      ctx.stroke();
    } else if (Math.abs(w.w1) > 1e-6) {
      const x = -w.bias / w.w1;
      ctx.moveTo(toPx(x), PAD);
      ctx.lineTo(toPx(x), PAD + SIZE);
      ctx.stroke();
    }

    // чотири логічні набори входів
    INPUTS.forEach(([x1, x2], i) => {
      const r = forward(x1, x2, w, act);
      const ok = r.bit === fn.targets[i];
      const cx = toPx(x1), cy = toPy(x2);
      if (i === selected) {
        ctx.beginPath();
        ctx.arc(cx, cy, 15, 0, Math.PI * 2);
        ctx.strokeStyle = '#4c9aff';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.arc(cx, cy, 9, 0, Math.PI * 2);
      ctx.fillStyle = fn.targets[i] === 1 ? '#3fb950' : '#161b22';
      ctx.fill();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = ok ? '#3fb950' : '#f0616d';
      ctx.stroke();
      ctx.fillStyle = '#9aa7b4';
      ctx.font = '11px Consolas, monospace';
      ctx.fillText(`(${x1},${x2})→${fn.targets[i]}`, cx + 14, cy - 10);
    });
  }, [w, act, fn, selected]);

  return (
    <canvas
      ref={ref}
      style={{ width: '100%', maxWidth: PAD * 2 + SIZE, aspectRatio: '1 / 1' }}
    />
  );
}
