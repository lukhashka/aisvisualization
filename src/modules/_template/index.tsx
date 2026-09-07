/**
 * ШАБЛОН НОВОГО МОДУЛЯ.
 *
 * 1. Скопіюй цю папку під новою назвою, напр. src/modules/perceptron-learning/
 * 2. Заповни id / title / subtitle / icon та напиши свій компонент.
 * 3. Зареєструй модуль у src/core/registry.ts.
 *
 * Цей файл навмисно НЕ зареєстрований — він лише приклад.
 */
import { useState } from 'react';
import type { TaskModule } from '../../core/types';
import { Slider } from '../../components/controls/Slider';
import { ButtonGroup } from '../../components/controls/ButtonGroup';

function TemplateTask() {
  const [a, setA] = useState(1);
  const [mode, setMode] = useState<'one' | 'two'>('one');

  return (
    <div className="grid grid--2">
      {/* ліва колонка — параметри */}
      <aside className="panel">
        <p className="panel__title">Параметри</p>
        <Slider label="Параметр a" value={a} onChange={setA} min={-5} max={5} step={0.1} />
        <ButtonGroup
          label="Режим"
          value={mode}
          onChange={setMode}
          options={[
            { value: 'one', label: 'Перший' },
            { value: 'two', label: 'Другий' },
          ]}
        />
      </aside>

      {/* права колонка — візуалізації */}
      <div className="grid">
        <section className="panel">
          <p className="panel__title">Візуалізація</p>
          <div className="formula">a = {a.toFixed(2)}, режим = {mode}</div>
        </section>

        <section className="panel">
          <p className="panel__title">Теорія</p>
          <div className="theory">
            <p>Опис задачі, формули, висновки.</p>
          </div>
        </section>
      </div>
    </div>
  );
}

const taskModule: TaskModule = {
  id: 'template',
  title: 'Назва задачі',
  subtitle: 'Короткий опис у меню',
  icon: '🧩',
  Component: TemplateTask,
};

export default taskModule;
