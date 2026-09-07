# Системи штучного інтелекту — інтерактивні лабораторні

Сайт-збірник інтерактивних візуалізацій до курсу. Кожна лабораторна — окремий
самодостатній **модуль**; меню й маршрутизація будуються з реєстру автоматично.

## Запуск

```bash
npm install
npm run dev      # http://localhost:5173
```

Збірка статичного сайту:

```bash
npm run build    # результат у dist/
npm run preview  # локальний перегляд зібраного
```

Роутинг — на хеші (`#/logic-neuron`), тому жодних налаштувань сервера не потрібно:
вміст `dist/` можна залити на будь-який статичний хостинг.

## Публікація на GitHub Pages

Сайт: **https://lukhashka.github.io/aisvisualization/**

Розгортання автоматичне: будь-який `push` у гілку `main` запускає
[.github/workflows/deploy.yml](.github/workflows/deploy.yml), який збирає проєкт
і публікує `dist/` на Pages.

```bash
git add -A
git commit -m "опис змін"
git push          # через ~1 хв зміни вже на сайті
```

Разове налаштування в репозиторії (робиться один раз):
**Settings → Pages → Build and deployment → Source: `GitHub Actions`**.

Базовий шлях (`base`) підставляється у воркфлоу автоматично з назви репозиторію
(`BASE_PATH`), тож при перейменуванні репо нічого правити не треба. Локально
`base` завжди `/`.

Стан останнього розгортання видно на вкладці
[Actions](https://github.com/lukhashka/aisvisualization/actions).

## Структура

```
src/
  core/
    types.ts        типи TaskModule / Topic
    registry.ts     ← СПИСОК ВСІХ ТЕМ І ЗАДАЧ
    useHashRoute.ts мінімальний хеш-роутер
  components/       спільні для всіх модулів UI-цеглинки
    Sidebar.tsx  Home.tsx  Plot.tsx  LazyPlot.tsx
    controls/Slider.tsx  controls/ButtonGroup.tsx
  lib/              спільна математика (neuron.ts)
  modules/
    _template/      шаблон нового модуля (не зареєстрований)
    logic-neuron/   лаб. 1 — логічні функції на одному нейроні
  styles/global.css спільна тема й класи (.panel, .grid, .ttable, .btn …)
```

## Як додати нову задачу

1. Скопіюй `src/modules/_template/` у `src/modules/<твоя-задача>/`.
2. У `index.tsx` заповни `id`, `title`, `subtitle`, `icon` і напиши компонент.
3. Додай у `src/core/registry.ts`:

```ts
import myTask from '../modules/my-task';

export const topics: Topic[] = [
  { id: 'neural-basics', title: 'Основи нейронних мереж', tasks: [logicNeuron, myTask] },
];
```

Меню, головна сторінка і маршрут `#/my-task` з'являться самі.

Щоб додати **нову тему** — просто додай ще один об'єкт у масив `topics`.

## Спільні класи оформлення

| Клас | Призначення |
|---|---|
| `.panel` + `.panel__title` | картка-блок із заголовком |
| `.grid`, `.grid--2`, `.grid--halves` | сітки (адаптивні) |
| `.formula`, `.note`, `.theory` | формула, виноска-попередження, текст теорії |
| `.btn`, `.btn--active`, `.btn-group` | кнопки |
| `.ttable`, `.ok`, `.bad`, `.badge` | таблиці й статуси |

## Лабораторна 1 — логічні функції на одному нейроні

- ваги `w₁`, `w₂` та зміщення `b` регулюються слайдерами наживо;
- пресети AND, OR, NOT, NAND, NOR і навмисно нерозв'язний XOR;
- активації: порогова, сигмоїда, tanh, ReLU (для гладких — крутизна `k`);
- SVG-схема нейрона з підсвіткою знаку й «товщини» ваг;
- таблиця істинності з перевіркою кожного набору;
- площина входів із розділювальною прямою;
- 3D-поверхня `y = f(w₁x₁ + w₂x₂ + b)` (Plotly, gl3d-збірка, вантажиться лениво).
