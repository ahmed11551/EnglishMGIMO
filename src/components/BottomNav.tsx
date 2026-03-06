import { Link, useLocation } from 'react-router-dom';
import { IconToday, IconTopics, IconProgress } from './BottomNavIcons';
import './BottomNav.css';

export function BottomNav() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <nav className="bottom-nav" aria-label="Главная навигация">
      <Link
        to="/"
        className={`bottom-nav-item ${path === '/' ? 'active' : ''}`}
        aria-current={path === '/' ? 'page' : undefined}
      >
        <span className="bottom-nav-icon"><IconToday /></span>
        <span className="bottom-nav-label">Сегодня</span>
      </Link>
      <Link
        to="/topics"
        className={`bottom-nav-item ${path.startsWith('/topics') ? 'active' : ''}`}
        aria-current={path.startsWith('/topics') ? 'page' : undefined}
      >
        <span className="bottom-nav-icon"><IconTopics /></span>
        <span className="bottom-nav-label">Темы</span>
      </Link>
      <Link
        to="/stats"
        className={`bottom-nav-item ${path.startsWith('/stats') ? 'active' : ''}`}
        aria-current={path.startsWith('/stats') ? 'page' : undefined}
      >
        <span className="bottom-nav-icon"><IconProgress /></span>
        <span className="bottom-nav-label">Прогресс</span>
      </Link>
    </nav>
  );
}
