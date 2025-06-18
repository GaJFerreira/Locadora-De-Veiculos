import { useState, FormEvent } from 'react';
import withAdminAuth from '@/components/withAdminAuth'; // Importa nosso HOC

function AdminDashboard() {
  const [formData, setFormData] = useState({
    modelo: '',
    marca: '',
    ano: '',
    cor: '',
    placa: '',
    renavam: '',
    chasis: '',
    quilometragem: '',
    valorFipe: '',
    tipoVeiculo: 'CARRO', // Valor padrão
  });
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage('');
    const token = localStorage.getItem('authToken');

    // Converte os campos numéricos
    const dataToSend = {
      ...formData,
      ano: parseInt(formData.ano, 10),
      quilometragem: parseInt(formData.quilometragem, 10),
      valorFipe: parseFloat(formData.valorFipe),
    };

    try {
      const response = await fetch('/api/veiculos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Falha ao cadastrar veículo.');
      }

      setMessage('Veículo cadastrado com sucesso!');
      // Limpar o formulário seria uma boa próxima etapa aqui
      
    } catch (err: any) {
      setMessage(`Erro: ${err.message}`);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px' }}>
      <h1>Painel de Administração</h1>
      <h2>Cadastrar Novo Veículo</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* Adicione um input para cada campo do formulário */}
        <input name="marca" value={formData.marca} onChange={handleChange} placeholder="Marca" required style={{color: '#333'}} />
        <input name="modelo" value={formData.modelo} onChange={handleChange} placeholder="Modelo" required style={{color: '#333'}} />
        <input name="ano" type="number" value={formData.ano} onChange={handleChange} placeholder="Ano" required style={{color: '#333'}} />
        <input name="placa" value={formData.placa} onChange={handleChange} placeholder="Placa" required style={{color: '#333'}} />
        <input name="cor" value={formData.cor} onChange={handleChange} placeholder="Cor" required style={{color: '#333'}} />
        <input name="renavam" value={formData.renavam} onChange={handleChange} placeholder="Renavam" required style={{color: '#333'}} />
        <input name="chasis" value={formData.chasis} onChange={handleChange} placeholder="Chassi" required style={{color: '#333'}} />
        <input name="quilometragem" type="number" value={formData.quilometragem} onChange={handleChange} placeholder="Quilometragem" required style={{color: '#333'}} />
        <input name="valorFipe" type="number" step="0.01" value={formData.valorFipe} onChange={handleChange} placeholder="Valor FIPE" required style={{color: '#333'}} />
        <select name="tipoVeiculo" value={formData.tipoVeiculo} onChange={handleChange} style={{color: '#333'}}>
          <option value="CARRO">Carro</option>
          <option value="MOTO">Moto</option>
        </select>
        <button type="submit">Cadastrar Veículo</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

// "Embrulha" a página com o HOC para garantir que apenas admins a acessem
export default withAdminAuth(AdminDashboard);