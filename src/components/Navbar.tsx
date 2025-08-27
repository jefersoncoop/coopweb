// components/Navbar.tsx (versão com delay)
"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './Navbar.module.css';
import { ThemeSwitcher } from './ThemeSwitcher'; // 1. Importar

export default function Navbar() {
  const router = useRouter();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  // Estado para guardar a referência do timer
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    router.push('/login');
  };

  const handleMouseEnter = () => {
    // Se houver um timer para fechar, cancele-o
    if (timer) {
      clearTimeout(timer);
      setTimer(null);
    }
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    // Crie um novo timer para fechar o menu após 300ms
    const newTimer = setTimeout(() => {
      setDropdownOpen(false);
    }, 300); // 300 milissegundos de delay
    setTimer(newTimer);
  };

  return (
    <nav className={styles.navbar}>
      {/* ... outra parte do JSX ... */}
      <ul className={styles.navLinks}>
        <li>
          <Link href="/dashboard">Dashboard</Link>
        </li>

        <li
          className={styles.dropdown}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <button className={styles.dropdownToggle}>
            Serviços ▼
          </button>
          {isDropdownOpen && (
            <ul className={styles.dropdownMenu}>
              <li>
                <Link href="/relatorios/" onClick={() => setDropdownOpen(false)}>Folha por mes</Link>
              </li>
            </ul>
          )}
        </li>
      </ul>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <ThemeSwitcher /> {/* 2. Adicionar o botão */}
        <button onClick={handleLogout} className={styles.logoutButton}>
          Sair
        </button>
      </div>
    </nav>
  );
}