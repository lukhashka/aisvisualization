import type { Topic, TaskModule } from './types';
import logicNeuron from '../modules/logic-neuron';

/**
 * РЕЄСТР МОДУЛІВ.
 *
 * Щоб додати нову задачу:
 *   1. створи папку src/modules/<твоя-задача>/ з файлом index.tsx,
 *      який робить `export default { id, title, subtitle, icon, Component }`
 *      (готовий приклад — src/modules/logic-neuron/index.tsx);
 *   2. імпортуй його сюди;
 *   3. додай у масив tasks потрібної теми (або створи нову тему).
 * Більше нічого міняти не треба — меню й роутинг оновляться самі.
 */
export const topics: Topic[] = [
  {
    id: 'neural-basics',
    title: 'Основи нейронних мереж',
    tasks: [logicNeuron],
  },
  // {
  //   id: 'search',
  //   title: 'Пошук та логічний вивід',
  //   tasks: [],
  // },
];

export const allTasks: TaskModule[] = topics.flatMap((t) => t.tasks);

export function findTask(id: string | null): TaskModule | undefined {
  return allTasks.find((t) => t.id === id);
}
