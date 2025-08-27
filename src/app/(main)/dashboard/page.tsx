// app/dashboard/page.tsx
"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
const appurl = process.env.NEXT_PUBLIC_SYSURL;
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard', // Isso resultará em "Login | Coop Web" na aba
};


// A interface para os dados continua a mesma
interface ApiData {
  CPF: number;
  NOME: string;
  COD_COOPERADO: string;
}

export default function DashboardPage() {
  const router = useRouter();
  
  // NOVO ESTADO: para guardar o termo da busca
  const [searchTerm, setSearchTerm] = useState('');

  // Estados existentes, agora serão controlados pela busca
  const [data, setData] = useState<ApiData[]>([]);
  const [loading, setLoading] = useState(false); // Inicia como false
  const [error, setError] = useState('');
  
  // useEffect AGORA SÓ CUIDA DA AUTENTICAÇÃO
  // Ele verifica o token assim que a página carrega.
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  // NOVA FUNÇÃO: chamada pelo formulário para buscar os dados
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault(); // Impede que o formulário recarregue a página
    
    if (!searchTerm) {
      alert('Por favor, digite algo para buscar.');
      return;
    }

    const token = localStorage.getItem('authToken');
    setLoading(true); // Inicia o loading
    setError('');     // Limpa erros antigos
    setData([]);      // Limpa dados antigos

    try {
      // A URL agora inclui o termo da busca como um query parameter
      // Exemplo: https://sua-api.com/dados?filtro=texto-digitado
      const response = await axios.get(`${appurl}/user/getCooperadosByName/${searchTerm}`, { // <-- ATUALIZE A URL
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setData(response.data);

    } catch (err) {
      console.error('Erro ao buscar dados:', err);
      setError('Falha ao buscar dados. Verifique o termo e tente novamente.');
    } finally {
      setLoading(false); // Finaliza o loading, tanto em caso de sucesso quanto de erro
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    router.push('/login');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Dashboard de Busca</h1>
      
      {/* NOVO FORMULÁRIO DE BUSCA */}
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Digite o nome para buscar"
          style={{ padding: '8px', width: '300px' }}
        />
        <button type="submit" disabled={loading} style={{ padding: '8px 16px', marginLeft: '10px' }}>
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
      </form>

      {/* ÁREA DE RESULTADOS */}
      <div style={{ marginTop: '20px' }}>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        {data.length > 0 && (
          <ul>
            {data.map(item => (
              <li key={item.CPF}>
                <strong>{item.COD_COOPERADO}:</strong> CPF: {item.CPF} NOME: {item.NOME}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}