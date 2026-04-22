import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { isDark, toggleTheme, colors } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      style={{
        ...styles.toggleBtn,
        background: colors.bg.secondary,
        border: `1px solid ${colors.border.primary}`,
        color: colors.text.primary,
      }}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  );
}

const styles = {
  toggleBtn: {
    fontSize: '18px',
    cursor: 'pointer',
    padding: '8px 12px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
  }
};
