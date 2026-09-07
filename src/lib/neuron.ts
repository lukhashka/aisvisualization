export type ActivationId = 'step' | 'sigmoid' | 'tanh' | 'relu';

export interface Activation {
  id: ActivationId;
  label: string;
  /** Коротка назва для кнопок */
  short: string;
  /** y = f(net) */
  f: (net: number, k: number) => number;
  /** Діапазон значень для осі Z графіка */
  range: [number, number];
  formula: string;
  /** Поріг, вище якого вихід вважаємо логічною одиницею */
  threshold: number;
}

export const activations: Record<ActivationId, Activation> = {
  step: {
    id: 'step',
    label: 'Порогова (step)',
    short: 'Порогова',
    f: (net) => (net >= 0 ? 1 : 0),
    range: [-0.15, 1.15],
    formula: 'f(net) = 1, якщо net ≥ 0;  інакше 0',
    threshold: 0.5,
  },
  sigmoid: {
    id: 'sigmoid',
    label: 'Сигмоїда',
    short: 'Сигмоїда',
    f: (net, k) => 1 / (1 + Math.exp(-k * net)),
    range: [-0.15, 1.15],
    formula: 'f(net) = 1 / (1 + e^(−k·net))',
    threshold: 0.5,
  },
  tanh: {
    id: 'tanh',
    label: 'Гіперболічний тангенс',
    short: 'tanh',
    f: (net, k) => Math.tanh(k * net),
    range: [-1.15, 1.15],
    formula: 'f(net) = tanh(k·net)',
    threshold: 0,
  },
  relu: {
    id: 'relu',
    label: 'ReLU',
    short: 'ReLU',
    f: (net) => Math.max(0, net),
    range: [-0.2, 3],
    formula: 'f(net) = max(0, net)',
    threshold: 0.5,
  },
};

export interface Weights {
  w1: number;
  w2: number;
  bias: number;
  k: number;
}

/** Зважена сума входів зі зміщенням: net = w1·x1 + w2·x2 + b */
export function net(x1: number, x2: number, w: Weights): number {
  return w.w1 * x1 + w.w2 * x2 + w.bias;
}

/** Повний прохід нейрона */
export function forward(x1: number, x2: number, w: Weights, act: Activation) {
  const n = net(x1, x2, w);
  const y = act.f(n, w.k);
  return { net: n, y, bit: y >= act.threshold ? 1 : 0 };
}

/** Логічні функції двох змінних: цільові виходи для (0,0) (0,1) (1,0) (1,1) */
export interface LogicFn {
  id: string;
  label: string;
  targets: [number, number, number, number];
  /** Ваги, що реалізують функцію; null — функція лінійно нероздільна */
  preset: { w1: number; w2: number; bias: number } | null;
  /** Скільки входів реально використовується */
  arity: 1 | 2;
  note?: string;
}

export const logicFns: LogicFn[] = [
  { id: 'and',  label: 'AND (І)',        targets: [0, 0, 0, 1], preset: { w1: 1, w2: 1, bias: -1.5 }, arity: 2 },
  { id: 'or',   label: 'OR (АБО)',       targets: [0, 1, 1, 1], preset: { w1: 1, w2: 1, bias: -0.5 }, arity: 2 },
  { id: 'not',  label: 'NOT (НЕ x₁)',    targets: [1, 1, 0, 0], preset: { w1: -1, w2: 0, bias: 0.5 }, arity: 1,
    note: 'NOT — функція одного входу, тому вага w₂ = 0: x₂ не впливає на результат.' },
  { id: 'nand', label: 'NAND (І-НЕ)',    targets: [1, 1, 1, 0], preset: { w1: -1, w2: -1, bias: 1.5 }, arity: 2 },
  { id: 'nor',  label: 'NOR (АБО-НЕ)',   targets: [1, 0, 0, 0], preset: { w1: -1, w2: -1, bias: 0.5 }, arity: 2 },
  { id: 'xor',  label: 'XOR (виключне АБО)', targets: [0, 1, 1, 0], preset: null, arity: 2,
    note: 'XOR неможливо реалізувати одним нейроном: точки класів не розділяються жодною прямою. Потрібна мережа щонайменше з двох шарів.' },
];

/** Чотири комбінації входів у фіксованому порядку */
export const INPUTS: [number, number][] = [
  [0, 0],
  [0, 1],
  [1, 0],
  [1, 1],
];
