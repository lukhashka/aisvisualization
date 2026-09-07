import { Suspense, lazy } from 'react';
import type { Data, Layout } from 'plotly.js';

const Plot = lazy(() => import('./Plot').then((m) => ({ default: m.Plot })));

interface Props {
  data: Data[];
  layout: Partial<Layout>;
  height?: number;
}

/** Plotly важкий, тому вантажимо його окремим чанком лише коли графік справді потрібен. */
export function LazyPlot(props: Props) {
  return (
    <Suspense
      fallback={
        <div style={{ height: props.height ?? 420, display: 'grid', placeItems: 'center',
                      color: 'var(--text-dim)', fontSize: '.85rem' }}>
          Завантаження графіка…
        </div>
      }
    >
      <Plot {...props} />
    </Suspense>
  );
}
