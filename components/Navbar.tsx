// components/Navbar.tsx (versão com delay)
"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react'; 
import styles from './Navbar.module.css';

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
                <Link href="/relatorios/" onClick={() => setDropdownOpen(false)}>Relatorios</Link>
              </li>
              <li>
                <Link href="/servicos/relatorios" onClick={() => setDropdownOpen(false)}>_____</Link>
              </li>
              <li>
                <Link href="/servicos/config" onClick={() => setDropdownOpen(false)}>_____</Link>
              </li>
            </ul>
          )}
        </li>

        <li>
          <Link href="/outra-pagina">Outra Página</Link>
        </li>
      </ul>
      <button onClick={handleLogout} className={styles.logoutButton}>
        Sair
      </button>
    </nav>
  );
}