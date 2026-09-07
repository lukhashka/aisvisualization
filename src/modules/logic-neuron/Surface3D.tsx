import { useMemo } from 'react';
import type { Data, Layout } from 'plotly.js';
import { LazyPlot } from '../../components/LazyPlot';
import type { Activation, LogicFn, Weights } from '../../lib/neuron';
import { INPUTS, forward } from '../../lib/neuron';

interface Props {
  w: Weights;
  act: Activation;
  fn: LogicFn;
}

const LO = -0.6, HI = 1.6, N = 56;

/** 3D-поверхня виходу нейрона y = f(w₁x₁ + w₂x₂ + b). */
export function Surface3D({ w, act, fn }: Props) {
  const data = useMemo<Data[]>(() => {
    const axis = Array.from({ length: N }, (_, i) => LO + ((HI - LO) * i) / (N - 1));
    const z = axis.map((x2) => axis.map((x1) => act.f(w.w1 * x1 + w.w2 * x2 + w.bias, w.k)));

    const pts = INPUTS.map(([x1, x2], i) => ({
      x1, x2,
      y: forward(x1, x2, w, act).y,
      ok: forward(x1, x2, w, act).bit === fn.targets[i],
      target: fn.targets[i],
    }));

    return [
      {
        type: 'surface',
        x: axis,
        y: axis,
        z,
        opacity: 0.92,
        colorscale: [
          [0, '#2d5f9e'],
          [0.5, '#4c9aff'],
          [1, '#3fb950'],
        ],
        showscale: false,
        contours: {
          z: { show: true, usecolormap: true, project: { z: true } },
        },
        hovertemplate: 'x₁=%{x:.2f}<br>x₂=%{y:.2f}<br>y=%{z:.3f}<extra></extra>',
      } as Data,
      {
        type: 'scatter3d',
        mode: 'text+markers',
        x: pts.map((p) => p.x1),
        y: pts.map((p) => p.x2),
        z: pts.map((p) => p.y),
        text: pts.map((p) => `${p.target}`),
        textposition: 'top center',
        textfont: { color: '#e6edf3', size: 11 },
        marker: {
          size: 7,
          color: pts.map((p) => (p.ok ? '#3fb950' : '#f0616d')),
          line: { color: '#0e1116', width: 1 },
        },
        hovertemplate: 'вхід (%{x}, %{y})<br>y=%{z:.3f}<extra></extra>',
      } as Data,
    ];
  }, [w, act, fn]);

  const layout = useMemo<Partial<Layout>>(() => ({
    scene: {
      xaxis: { title: { text: 'x₁' }, gridcolor: '#2a323d', zerolinecolor: '#3b4653',
               backgroundcolor: 'rgba(0,0,0,0)', showbackground: true, range: [LO, HI] },
      yaxis: { title: { text: 'x₂' }, gridcolor: '#2a323d', zerolinecolor: '#3b4653',
               backgroundcolor: 'rgba(0,0,0,0)', showbackground: true, range: [LO, HI] },
      zaxis: { title: { text: 'y' }, gridcolor: '#2a323d', zerolinecolor: '#3b4653',
               backgroundcolor: 'rgba(0,0,0,0)', showbackground: true, range: act.range },
      camera: { eye: { x: 1.5, y: -1.6, z: 1.05 } },
      aspectratio: { x: 1, y: 1, z: 0.75 },
    },
    margin: { l: 0, r: 0, t: 0, b: 0 },
  }), [act]);

  return <LazyPlot data={data} layout={layout} height={440} />;
}
