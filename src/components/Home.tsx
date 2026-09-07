import { topics } from '../core/registry';

export function Home({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <>
      <header className="main__header">
        <h1>Системи штучного інтелекту</h1>
        <p>Збірник інтерактивних візуалізацій до лабораторних робіт курсу.</p>
      </header>

      <div className="grid grid--halves">
        {topics.flatMap((topic) =>
          topic.tasks.map((task) => (
            <div className="panel" key={task.id}>
              <p className="panel__title">{topic.title}</p>
              <h2>
                {task.icon} {task.title}
              </h2>
              <p className="theory">{task.subtitle}</p>
              <button className="btn btn--active" onClick={() => onNavigate(task.id)}>
                Відкрити →
              </button>
            </div>
          )),
        )}
      </div>
    </>
  );
}
