import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load theme preference from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(prefersDark);
    }
    setIsLoaded(true);
  }, []);

  const toggleTheme = () => {
    setIsDark(prev => {
      const newValue = !prev;
      localStorage.setItem('theme', newValue ? 'dark' : 'light');
      return newValue;
    });
  };

  const theme = {
    isDark,
    toggleTheme,
    colors: isDark ? darkTheme : lightTheme
  };

  if (!isLoaded) {
    return <div style={{ background: '#0a0a0f', minHeight: '100vh' }} />;
  }

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

const lightTheme = {
  bg: {
    primary: '#ffffff',
    secondary: '#f5f5f5',
    tertiary: '#efefef',
    card: '#ffffff',
    nav: '#ffffff'
  },
  text: {
    primary: '#1a1a1a',
    secondary: '#555555',
    tertiary: '#888888',
    light: '#ffffff'
  },
  border: {
    primary: '#e0e0e0',
    secondary: '#d0d0d0'
  },
  accent: {
    primary: '#00d4ff',
    secondary: '#7b2ff7',
    highlight: '#a78bfa'
  },
  shadow: 'rgba(0, 0, 0, 0.1)',
  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)'
};

const darkTheme = {
  bg: {
    primary: '#0a0a0f',
    secondary: '#11111d',
    tertiary: '#1a1a27',
    card: '#11111d',
    nav: '#0a0a0f'
  },
  text: {
    primary: '#ffffff',
    secondary: '#cccccc',
    tertiary: '#888888',
    light: '#ffffff'
  },
  border: {
    primary: '#1e1e2e',
    secondary: '#2a2a3e'
  },
  accent: {
    primary: '#00d4ff',
    secondary: '#7b2ff7',
    highlight: '#a78bfa'
  },
  shadow: 'rgba(0, 0, 0, 0.5)',
  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
};
