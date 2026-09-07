import { topics } from '../core/registry';

interface Props {
  activeId: string | null;
  onNavigate: (id: string) => void;
}

export function Sidebar({ activeId, onNavigate }: Props) {
  return (
    <nav className="sidebar">
      <a className="sidebar__brand" onClick={() => onNavigate('')}>
        <b>Системи штучного інтелекту</b>
        <span>Інтерактивні лабораторні роботи</span>
      </a>

      {topics.map((topic) => (
        <div className="sidebar__topic" key={topic.id}>
          <p className="sidebar__topic-title">{topic.title}</p>
          {topic.tasks.map((task) => (
            <button
              key={task.id}
              className={'navlink' + (task.id === activeId ? ' navlink--active' : '')}
              onClick={() => onNavigate(task.id)}
            >
              <span aria-hidden>{task.icon ?? '•'}</span>
              <span>
                <span className="navlink__title">{task.title}</span>
                {task.subtitle && <span className="navlink__sub">{task.subtitle}</span>}
              </span>
            </button>
          ))}
          {topic.tasks.length === 0 && (
            <p className="control__hint" style={{ marginLeft: 10 }}>
              поки що порожньо
            </p>
          )}
        </div>
      ))}
    </nav>
  );
}
