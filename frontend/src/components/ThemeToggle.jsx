import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg border border-primary flex items-center justify-center bg-secondary text-primary hover:shadow-md active:scale-95 transition-all font-semibold text-xl cursor-pointer hover:-translate-y-0.5"
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  );
};
