// src/app/page.tsx
"use client"; // Obrigatório para usar hooks como useEffect e useRouter

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // 1. Tenta obter o token de autenticação do localStorage do navegador.
    const token = localStorage.getItem('authToken');

    // 2. Verifica se o token existe.
    if (token) {
      // Se existe, o utilizador está autenticado. Redireciona para o dashboard.
      router.push('/dashboard');
    } else {
      // Se não existe, o utilizador não está autenticado. Redireciona para a página de login.
      router.push('/login');
    }
  }, [router]); // O useEffect é executado uma vez quando o componente é montado.

  // 3. Enquanto a verificação acontece, mostramos uma mensagem de carregamento.
  //    Isto evita que o utilizador veja uma página em branco a piscar.
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <p>A carregar...</p>
    </div>
  );
}