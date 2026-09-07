import { useState } from 'react';
import type { TaskModule } from '../../core/types';
import { Slider } from '../../components/controls/Slider';
import { ButtonGroup } from '../../components/controls/ButtonGroup';
import type { ActivationId, Weights } from '../../lib/neuron';
import { INPUTS, activations, logicFns } from '../../lib/neuron';
import { NeuronScheme } from './NeuronScheme';
import { TruthTable } from './TruthTable';
import { DecisionPlane } from './DecisionPlane';
import { Surface3D } from './Surface3D';
import { Theory } from './Theory';

function LogicNeuron() {
  const [w, setW] = useState<Weights>({ w1: 1, w2: 1, bias: -1.5, k: 5 });
  const [actId, setActId] = useState<ActivationId>('step');
  const [fnId, setFnId] = useState('and');
  const [selected, setSelected] = useState(3);

  const act = activations[actId];
  const fn = logicFns.find((f) => f.id === fnId)!;
  const set = (patch: Partial<Weights>) => setW((prev) => ({ ...prev, ...patch }));

  const applyPreset = (id: string) => {
    setFnId(id);
    const p = logicFns.find((f) => f.id === id)!.preset;
    if (p) set(p);
  };

  const [x1, x2] = INPUTS[selected];

  return (
    <div className="grid grid--2">
      {/* ---------- Панель параметрів ---------- */}
      <aside className="panel">
        <p className="panel__title">Параметри нейрона</p>

        <ButtonGroup
          label="Цільова логічна функція"
          value={fnId}
          onChange={applyPreset}
          options={logicFns.map((f) => ({ value: f.id, label: f.label.split(' ')[0] }))}
        />

        <Slider label="Вага w₁" value={w.w1} onChange={(v) => set({ w1: v })} />
        <Slider label="Вага w₂" value={w.w2} onChange={(v) => set({ w2: v })} />
        <Slider
          label="Зміщення b (поріг −θ)"
          value={w.bias}
          onChange={(v) => set({ bias: v })}
          hint="Зсуває розділювальну пряму, не змінюючи її нахилу"
        />

        <ButtonGroup
          label="Функція активації"
          value={actId}
          onChange={setActId}
          options={Object.values(activations).map((a) => ({ value: a.id, label: a.short, title: a.label }))}
        />
        <div className="formula" style={{ marginBottom: 16 }}>{act.formula}</div>

        {(actId === 'sigmoid' || actId === 'tanh') && (
          <Slider
            label="Крутизна k"
            value={w.k}
            onChange={(v) => set({ k: v })}
            min={0.5} max={20} step={0.5} digits={1}
            hint="Чим більше k, тим ближче сигмоїда до порогової функції"
          />
        )}

        <div className="btn-group" style={{ marginTop: 8 }}>
          <button className="btn" onClick={() => set({ w1: 0, w2: 0, bias: 0 })}>
            Обнулити ваги
          </button>
          <button
            className="btn"
            onClick={() =>
              set({
                w1: +(Math.random() * 4 - 2).toFixed(2),
                w2: +(Math.random() * 4 - 2).toFixed(2),
                bias: +(Math.random() * 4 - 2).toFixed(2),
              })
            }
          >
            Випадкові ваги
          </button>
        </div>

        {fn.note && <div className="note" style={{ marginTop: 16 }}>{fn.note}</div>}
      </aside>

      {/* ---------- Візуалізації ---------- */}
      <div className="grid">
        <section className="panel">
          <p className="panel__title">Схема нейрона</p>
          <NeuronScheme w={w} act={act} x1={x1} x2={x2} />
          <div className="formula" style={{ marginTop: 12 }}>
            net = {w.w1.toFixed(2)}·{x1} + {w.w2.toFixed(2)}·{x2} + ({w.bias.toFixed(2)}) ={' '}
            {(w.w1 * x1 + w.w2 * x2 + w.bias).toFixed(2)}
          </div>
          <p className="control__hint" style={{ marginTop: 8 }}>
            Обраний набір входів: (x₁, x₂) = ({x1}, {x2}). Клікни рядок таблиці нижче, щоб
            прогнати інший набір через схему.
          </p>
        </section>

        <section className="panel">
          <p className="panel__title">Таблиця істинності</p>
          <TruthTable w={w} act={act} fn={fn} selected={selected} onSelect={setSelected} />
        </section>

        <div className="grid grid--halves">
          <section className="panel">
            <p className="panel__title">Площина входів і розділювальна пряма</p>
            <DecisionPlane w={w} act={act} fn={fn} selected={selected} />
          </section>

          <section className="panel">
            <p className="panel__title">3D-графік виходу нейрона</p>
            <Surface3D w={w} act={act} fn={fn} />
            <p className="control__hint">
              Поверхня y = f(w₁x₁ + w₂x₂ + b). Обертай мишею, колесо — масштаб.
            </p>
          </section>
        </div>

        <section className="panel">
          <p className="panel__title">Теорія</p>
          <Theory />
        </section>
      </div>
    </div>
  );
}

const taskModule: TaskModule = {
  id: 'logic-neuron',
  title: 'Логічні функції на одному нейроні',
  subtitle: 'AND, OR, NOT, NAND, NOR та проблема XOR',
  icon: '⚡',
  Component: LogicNeuron,
};

export default taskModule;
