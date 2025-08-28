// app/relatorios/page.tsx
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

}
function formatDate(isoDate: string) {
  const date = new Date(isoDate);
  const dia = String(date.getDate()).padStart(2, '0');
  const mes = String(date.getMonth() + 1).padStart(2, '0');
  const ano = date.getFullYear();
  return `${dia}/${mes}/${ano}`;
}
const formatarMoeda = (valor: number) => {
  if (valor === null || valor === undefined) return '-';
  // Converte 835.4 para "R$ 835,40"
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor);
};
// 1. RENOMEAR O COMPONENTE PARA MAIOR CLAREZA
export default function RelatoriosPage() {
  const router = useRouter();
  // 2. DEFINIR OS CABEÇALHOS PARA O ARQUIVO CSV
  useEffect(() => {
    // Esta linha corre no navegador e define o título da aba
    document.title = "Relatorios | Coop Web";
  }, []); // O array vazio [] garante que isto só corre uma vez
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
  // --- NOVAS LISTAS PARA OS DROPDOWNS ---
  const meses = [
    { value: '01', label: 'Janeiro' }, { value: '02', label: 'Fevereiro' },
    { value: '03', label: 'Março' }, { value: '04', label: 'Abril' },
    { value: '05', label: 'Maio' }, { value: '06', label: 'Junho' },
    { value: '07', label: 'Julho' }, { value: '08', label: 'Agosto' },
    { value: '09', label: 'Setembro' }, { value: '10', label: 'Outubro' },
    { value: '11', label: 'Novembro' }, { value: '12', label: 'Dezembro' }
  ];

  // Gera a lista de anos dinamicamente
  const anoAtual = new Date().getFullYear();
  const anos = [];
  for (let ano = anoAtual + 1; ano >= 2020; ano--) {
    anos.push(ano);
  }
  // --- FIM DAS LISTAS ---

  // 2. AJUSTAR ESTADO INICIAL PARA PRÉ-SELECIONAR O MÊS/ANO ATUAL
  const mesAtual = String(new Date().getMonth() + 1).padStart(2, '0');
  const [searchMes, setSearchMes] = useState(mesAtual);
  const [searchAno, setSearchAno] = useState(String(anoAtual));
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

    if (!searchMes) {
      alert('digite mes e ano para buscar.');
      return;
    }

    const token = localStorage.getItem('authToken');
    setLoading(true); // Inicia o loading
    setError('');     // Limpa erros antigos
    setData([]);      // Limpa dados antigos

    try {
      // A URL agora inclui o termo da busca como um query parameter
      // Exemplo: https://sua-api.com/dados?filtro=texto-digitado
      const response = await axios.get(`${appurl}/user/folhames/${searchAno}/${searchMes}`, { // <-- ATUALIZE A URL
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
    <div>
      <h1>Folha por mes</h1>
      <div className={styles.actionsContainer}>
        {/* NOVO FORMULÁRIO DE BUSCA */}
        <form onSubmit={handleSearch}>
          {/* 4. SUBSTITUIR OS INPUTS POR SELECTS */}
          <select
            value={searchMes}
            onChange={(e) => setSearchMes(e.target.value)}
            style={{ padding: '8px', marginRight: '10px' }}
          >
            {meses.map(mes => (
              <option key={mes.value} value={mes.value}>
                {mes.label}
              </option>
            ))}
          </select>

          <select
            value={searchAno}
            onChange={(e) => setSearchAno(e.target.value)}
            style={{ padding: '8px', marginRight: '10px' }}
          >
            {anos.map(ano => (
              <option key={ano} value={ano}>
                {ano}
              </option>
            ))}
          </select>

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
        )}
      </div>

      {/*
        4. ÁREA DE RESULTADOS AGORA COM A TABELA
      */}
      <div style={{ marginTop: '20px' }}>
        {loading && <p>Carregando dados...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {!loading && data.length > 0 && (
          <div className={styles.tableContainer}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Código Cooperado</th>
                  <th>Nome</th>
                  <th>Contrato</th>
                  <th>Mes</th>
                  <th>Banco</th>
                  <th>Modalidade</th>
                  <th>Data Pagto.</th>
                  <th>Valor</th>
                </tr>
              </thead>
              <tbody>
                {data.map(item => (
                  <tr key={item.id}>
                    <td>{item.COD_COOPERADO}</td>
                    <td>{item.NOME}</td>
                    <td>{item.CONTRATO}</td>
                    <td>{item.MES}</td>
                    <td>{item.BANCO}</td>
                    <td>{item.MODALIDADE}</td>
                    <td>{formatDate(item.PAGTO_DATA)}</td>
                    <td>{formatarMoeda(item.VLR_CREDITO)}</td>
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