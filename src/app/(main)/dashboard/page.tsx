// app/dashboard/page.tsx
"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
const appurl = process.env.NEXT_PUBLIC_SYSURL;
import styles from './dashboard.module.css';


// A interface para os dados continua a mesma
interface ApiData {
  CPF: number;
  NOME: string;
  COD_COOPERADO: string;
  ATIVO_INAT: string;
  DATA_ASSOC: string;
  NASCIMENTO: string;

}
function formatDate(isoDate: string) {
  const date = new Date(isoDate);
  const dia = String(date.getDate()).padStart(2, '0');
  const mes = String(date.getMonth() + 1).padStart(2, '0');
  const ano = date.getFullYear();
  return `${dia}/${mes}/${ano}`;
}
export default function DashboardPage() {
  const router = useRouter();
  useEffect(() => {
    // Esta linha corre no navegador e define o título da aba
    document.title = "Dashboard | Coop Web";
  }, []); // O array vazio [] garante que isto só corre uma vez
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
        {loading && <p>Carregando dados...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {!loading && data.length > 0 && (
          <div className={styles.tableContainer}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Código Cooperado</th>
                  <th>CPF</th>
                  <th>Nome</th>
                  <th>Data Associação</th>
                  <th>Nascimento</th>
                </tr>
              </thead>
              <tbody>
                {data.map(item => (
                  <tr key={item.COD_COOPERADO}>
                    <td>{item.ATIVO_INAT}</td>
                    <td>{item.COD_COOPERADO}</td>
                    <td>{item.CPF}</td>
                    <td>{item.NOME}</td>
                    <td>{formatDate(item.DATA_ASSOC)}</td>
                    <td>{formatDate(item.NASCIMENTO)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )} {!loading && !error && data.length === 0 && (
          <p>Nenhum resultado encontrado. Faça uma busca para exibir os dados.</p>
        )}
      </div>
    </div>
  );
}