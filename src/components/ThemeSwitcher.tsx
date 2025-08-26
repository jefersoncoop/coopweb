// components/ThemeSwitcher.tsx
"use client";

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

export const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Garante que o componente só é renderizado no cliente
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      style={{
        background: 'none',
        border: '1px solid #fff',
        color: '#fff',
        borderRadius: '5px',
        padding: '0.5rem 1rem',
        cursor: 'pointer'
      }}
    >
      {theme === 'dark' ? 'Claro' : 'Escuro'}
    </button>
  );
};