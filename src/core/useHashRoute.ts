import { useEffect, useState } from 'react';

/** Мінімальний хеш-роутер: #/<taskId>. Порожній хеш = головна. */
export function useHashRoute(): [string, (id: string) => void] {
  const read = () => window.location.hash.replace(/^#\/?/, '');
  const [route, setRoute] = useState(read);

  useEffect(() => {
    const onChange = () => setRoute(read());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  const navigate = (id: string) => {
    window.location.hash = id ? `/${id}` : '/';
  };

  return [route, navigate];
}
