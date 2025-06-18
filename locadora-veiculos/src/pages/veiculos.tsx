import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';

// Define uma interface para a estrutura de dados de um veículo
interface Veiculo {
  id: number;
  modelo: string;
  marca: string;
  ano: number;
  cor: string;
  placa: string;
  valorFipe: number;
}

export default function VeiculosPage() {
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // 1. Proteção do lado do cliente: se o usuário não estiver autenticado, redireciona para o login.
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // 2. Função para buscar os veículos da API
    const fetchVeiculos = async () => {
      // Pega o token do localStorage para enviar na requisição
      const token = localStorage.getItem('authToken');

      if (!token) {
        setError('Token não encontrado. Por favor, faça login novamente.');
        setIsLoading(false);
        router.push('/login');
        return;
      }

      try {
        const response = await fetch('/api/veiculos', {
          method: 'GET',
          headers: {
            // Envia o token no cabeçalho Authorization
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          // Se o token for inválido/expirado, a API retornará 401
          if (response.status === 401) {
              router.push('/login');
          }
          throw new Error('Falha ao buscar veículos.');
        }

        const data = await response.json();
        setVeiculos(data);

      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVeiculos();
  }, [isAuthenticated, router]); // Dependências do useEffect

  if (isLoading) {
    return <p>Carregando veículos...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px' }}>
      <h1>Veículos Disponíveis</h1>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {veiculos.map((veiculo) => (
          <li key={veiculo.id} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '15px', marginBottom: '10px' }}>
            <h2>{veiculo.marca} {veiculo.modelo}</h2>
            <p>Ano: {veiculo.ano} | Cor: {veiculo.cor}</p>
            <p>Placa: {veiculo.placa}</p>
            <p><strong>Valor FIPE: R$ {veiculo.valorFipe.toFixed(2)}</strong></p>
          </li>
        ))}
      </ul>
    </div>
  );
}