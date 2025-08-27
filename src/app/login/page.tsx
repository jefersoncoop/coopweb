// app/login/page.tsx
"use client";

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import styles from './Login.module.css'; // Importa nosso novo arquivo de estilo

const appurl = process.env.NEXT_PUBLIC_SYSURL;
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login', // Isso resultará em "Login | Coop Web" na aba
};

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post(`${appurl}/auth/login`, {
        cpf: username,
        senha: password,
      });
      const { token } = response.data;

      if (token) {
        localStorage.setItem('authToken', token);
        router.push('/dashboard');
      } else {
        setError('Token não retornado pela API.');
      }
    } catch (err: any) {
      console.error('Falha no login:', err);
      if (err.response && err.response.status === 401) {
        setError('Usuário ou senha inválidos. Tente novamente.');
      } else {
        setError('Erro ao conectar com o servidor. Tente mais tarde.');
      }
    }
  };

  return (
    <div className={styles.loginPage}>
      <form onSubmit={handleLogin} className={styles.loginForm}>
        <h1 className={styles.title}>Bem-vindo!</h1>
        
        <div className={styles.inputGroup}>
          <label htmlFor="username" className={styles.inputLabel}>Usuário (CPF):</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className={styles.inputField}
            placeholder="Digite seu CPF"
          />
        </div>
        
        <div className={styles.inputGroup}>
          <label htmlFor="password" className={styles.inputLabel}>Senha:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.inputField}
            placeholder="Digite sua senha"
          />
        </div>
        
        {error && <p className={styles.errorMessage}>{error}</p>}
        
        <button type="submit" className={styles.submitButton}>
          Entrar
        </button>
      </form>
    </div>
  );
}