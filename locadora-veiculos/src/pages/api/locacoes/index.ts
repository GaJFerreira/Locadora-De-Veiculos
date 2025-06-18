import type { NextApiResponse } from 'next'; // ALTERADO
import { PrismaClient } from '@prisma/client';
import { verificarToken, NextApiRequestComUsuario } from '@/utils/auth'; // ALTERADO

const prisma = new PrismaClient();

async function handler(req: NextApiRequestComUsuario, res: NextApiResponse) { // ALTERADO
  const { id: usuarioId, tipoUsuario } = req.usuario as { id: number, tipoUsuario: string }; // ALTERADO

  if (req.method === 'POST') {
    const {
      veiculoId,
      dataLocacao,
      dataDevolucao
      // removido statusLocacao do body, pois deve ser 'PENDENTE' por padrão
    } = req.body;

    // ALTERADO: O ID do usuário agora vem do token, não do corpo da requisição
    if (!veiculoId || !dataLocacao || !dataDevolucao) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    try {
      const locacaoExistente = await prisma.locacao.findFirst({
        where: { veiculoId, statusLocacao: 'PENDENTE' }
      });

      if (locacaoExistente) {
        return res.status(409).json({ error: 'Veículo já locado' });
      }

      const veiculo = await prisma.veiculo.findUnique({
        where: { id: veiculoId }
      });

      if (!veiculo) {
        return res.status(404).json({ error: 'Veículo não encontrado' });
      }

      const inicio = new Date(dataLocacao);
      const fim = new Date(dataDevolucao);
      const dias = Math.ceil((fim.getTime() - inicio.getTime()) / (1000 * 3600 * 24));

      if (dias <= 0) {
        return res.status(400).json({ error: 'Período de locação inválido' });
      }

      const diaria = veiculo.valorFipe * 0.005;
      const valorTotal = parseFloat((diaria * dias).toFixed(2));

      const localDevolucao = req.body.localDevolucao || 'Local padrão';
      const localRetirada = req.body.localRetirada || 'Local padrão';

      const novaLocacao = await prisma.locacao.create({
        data: {
          usuarioId: usuarioId, // ALTERADO: Usa o ID do token
          veiculoId,
          localDevolucao,
          localRetirada,
          dataLocacao: inicio,
          dataDevolucao: fim,
          valorTotal,
          statusLocacao: 'PENDENTE',
        }
      });

      return res.status(201).json(novaLocacao);

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao cadastrar locação' });
    }
  }

  if (req.method === 'GET') {
    try {
      // ALTERADO: Lógica de permissão para GET
      const where = tipoUsuario === 'ADMIN' ? {} : { usuarioId: usuarioId };
      const locacoes = await prisma.locacao.findMany({
        where,
        include: { usuario: true, veiculo: true }
      });
      return res.status(200).json(locacoes);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao buscar locações' });
    }
  }

  // ADICIONADO: Regra de permissão para PUT e DELETE (apenas ADMIN)
  if (req.method === 'PUT' || req.method === 'DELETE') {
    if (tipoUsuario !== 'ADMIN') {
        return res.status(403).json({ error: 'Acesso negado. Apenas administradores podem modificar ou deletar locações.' });
    }
    // O resto da lógica de PUT e DELETE continua aqui...
  }
  
  // (Lógica de PUT e DELETE original permanece aqui)
}

export default verificarToken(handler); // ALTERADO