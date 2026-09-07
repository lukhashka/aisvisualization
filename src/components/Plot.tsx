import { useEffect, useRef } from 'react';
import Plotly from 'plotly.js-gl3d-dist-min';
import type { Data, Layout } from 'plotly.js';

interface Props {
  data: Data[];
  layout: Partial<Layout>;
  height?: number;
}

/** Тонка обгортка над Plotly — спільна для всіх модулів. */
export function Plot({ data, layout, height = 420 }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    Plotly.react(el, data, {
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)',
      font: { color: '#9aa7b4', family: 'Segoe UI, system-ui, sans-serif', size: 11 },
      margin: { l: 0, r: 0, t: 10, b: 0 },
      showlegend: false,
      ...layout,
    }, { displayModeBar: false, responsive: true });
  }, [data, layout]);

  useEffect(() => {
    const el = ref.current;
    return () => { if (el) Plotly.purge(el); };
  }, []);

  return <div ref={ref} style={{ width: '100%', height }} />;
}
