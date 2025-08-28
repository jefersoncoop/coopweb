// app/relatoriogeral/page.tsx
"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
const appurl = process.env.NEXT_PUBLIC_SYSURL;

// 1. Importar o novo arquivo de estilo
import styles from './relatorios.module.css';
import { CSVLink } from 'react-csv';
// A interface para os dados continua a mesma
interface ApiData {
  index: number;
  id: number;
  CPF: string;
  NOME: string;
  COD_COOPERADO: string;
  CONTRATO: string;
  MES: string;
  PAGTO_DATA: string;
  PAGTO_VALOR: string;
  PAGTO_STATUS: string;
  PAGTO_TIPO: string;
  BANCO: string;
  VLR_CREDITO: number;
  MODALIDADE: string;
  NRO_INSS: string;
  NASCIMENTO: string;
  total: number;

}
function formatDate(isoDate: string) {
  const date = new Date(isoDate);
  const dia = String(date.getDate()).padStart(2, '0');
  const mes = String(date.getMonth() + 1).padStart(2, '0');
  const ano = date.getFullYear();
  return `${dia}/${mes}/${ano}`;
}
// 1. RENOMEAR O COMPONENTE PARA MAIOR CLAREZA
export default function RelatoriosPage() {
  const router = useRouter();
  const [data, setData] = useState<ApiData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1); // Estado para página atual
  const [totalPages, setTotalPages] = useState(1); // Estado para total de páginas
  const [shouldFetch, setShouldFetch] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [totalCooperados, setTotalCooperados] = useState(0);

  useEffect(() => {
    document.title = "Relatorio Geral | Coop Web";
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  // Função para buscar dados da página atual
  const fetchData = async (pageNumber: number) => {
    const token = localStorage.getItem('authToken');
    setLoading(true);
    setError('');
    setData([]);
    try {
      const response = await axios.get(`${appurl}/user/getCooperadosLista?page=${pageNumber}&pageSize=20`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      // Ajuste aqui conforme estrutura do retorno
      setData(response.data.data || []);
      const total = response.data.total || 0;
      const pageSize = response.data.pageSize || 20;
      setTotalPages(Math.ceil(total / pageSize));
      setTotalCooperados(total);
    } catch (err) {
      setError('Falha ao buscar dados. Verifique o termo e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Novo useEffect: só busca se shouldFetch for true
  useEffect(() => {
    if (hasSearched) {
      fetchData(page);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, hasSearched]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Sempre começa da página 1 ao buscar
    setHasSearched(true); // Ativa a busca
  };

  const headers = [
    {label : 'Código Cooperado', key: 'COD_COOPERADO' },
    {label : 'Mês', key: 'MES' },
    {label : 'Ano', key: 'ANO' },
    { label: 'Nome Completo', key: 'NOME' },
    { label: 'Contrato', key: 'CONTRATO' },
    { label: 'Banco', key: 'BANCO' },
    { label: 'Modalidade', key: 'MODALIDADE' },
    { label: 'Data Pagamento', key: 'PAGTO_DATA' },
    { label: 'Valor do Crédito', key: 'VLR_CREDITO' }
  ];
  return (
    <div>
      <h1>Todos os Cooperados Total: (total) </h1>
      <div className={styles.actionsContainer}>
        {/* NOVO FORMULÁRIO DE BUSCA */}
        <form onSubmit={handleSearch}>
          {/* 4. SUBSTITUIR OS INPUTS POR SELECTS */}

          <button type="submit" disabled={loading} style={{ padding: '8px' }}>
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
        </form>
        {/* 3. ADICIONAR O BOTÃO DE EXPORTAÇÃO */}
        {/* O botão só aparece se houver dados na tabela */}
        {data.length > 0 && (
          <CSVLink
            data={data}
            headers={headers}
            filename={"relatorio_folha.csv"}
            className={styles.exportButton} // Adicionaremos este estilo
            target="_blank"
          >
            Exportar para CSV
          </CSVLink>
          )
        }
      </div>

      {/*
        4. ÁREA DE RESULTADOS AGORA COM A TABELA
      */}
      <div style={{ marginTop: '20px' }}>
        {loading && <p>Carregando dados...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {!loading && data.length > 0 && (
          <>
                      <h2 style={{ marginBottom: '16px' }}>
               {totalCooperados}
            </h2>

            <div className={styles.tableContainer}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>Código Cooperado</th>
                    <th>CPF</th>
                    <th>Nome</th>
                    <th>PIS</th>
                    <th>Data Nascimento</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map(item => (
                    <tr key={item.COD_COOPERADO}>
                      <td>{item.COD_COOPERADO}</td>
                      <td>{item.CPF}</td>
                      <td>{item.NOME}</td>
                      <td>{item.NRO_INSS}</td>
                      <td>{formatDate(item.NASCIMENTO)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Paginação */}
            <div style={{ marginTop: '16px', display: 'flex', gap: '8px', justifyContent: 'center' }}>
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1 || loading}
              >
                Página anterior
              </button>
              <span>Página {page} de {totalPages}</span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages || loading}
              >
                Próxima página
              </button>
            </div>
          </>
        )}
        {!loading && !error && data.length === 0 && (
          <p>Nenhum resultado encontrado. Faça uma busca para exibir os dados.</p>
        )}
      </div>
    </div>
  );
}