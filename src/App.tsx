import { Sidebar } from './components/Sidebar';
import { Home } from './components/Home';
import { findTask } from './core/registry';
import { useHashRoute } from './core/useHashRoute';

export default function App() {
  const [route, navigate] = useHashRoute();
  const task = findTask(route);

  return (
    <div className="app">
      <Sidebar activeId={task?.id ?? null} onNavigate={navigate} />
      <main className="main">
        {task ? (
          <>
            <header className="main__header">
              <h1>{task.title}</h1>
              {task.subtitle && <p>{task.subtitle}</p>}
            </header>
            <task.Component />
          </>
        ) : (
          <Home onNavigate={navigate} />
        )}
      </main>
    </div>
  );
}
