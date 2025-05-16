import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const {
      usuarioId,
      veiculoId,
      dataLocacao,
      dataDevolucao,
      statusLocacao
    } = req.body

    if (!usuarioId || !veiculoId || !dataLocacao || !dataDevolucao || !statusLocacao) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' })
    }

    try {
      const locacaoExistente = await prisma.locacao.findFirst({
        where: {
          veiculoId,
          statusLocacao: 'PENDENTE'
        }
      })

      if (locacaoExistente) {
        return res.status(409).json({ error: 'Veículo já locado' })
      }

      const veiculo = await prisma.veiculo.findUnique({
        where: { id: veiculoId }
      })

      if (!veiculo) {
        return res.status(404).json({ error: 'Veículo não encontrado' })
      }

      const inicio = new Date(dataLocacao)
      const fim = new Date(dataDevolucao)
      const dias = Math.ceil((fim.getTime() - inicio.getTime()) / (1000 * 3600 * 24))

      if (dias <= 0) {
        return res.status(400).json({ error: 'Período de locação inválido' })
      }

      const diaria = veiculo.valorFipe * 0.005
      const valorTotal = parseFloat((veiculo.valorDiaria * dias).toFixed(2))

      const localDevolucao = req.body.localDevolucao || 'Local padrão';
      const localRetirada = req.body.localRetirada || 'Local padrão';

      const novaLocacao = await prisma.locacao.create({
        data: {
          usuarioId,
          veiculoId,
          localDevolucao,
          localRetirada,
          dataLocacao: inicio,
          dataDevolucao: fim,
          valorTotal,
          statusLocacao: 'PENDENTE',
        }
      })

      return res.status(201).json(novaLocacao)

    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Erro ao cadastrar locação' })
    }
  }

  if (req.method === 'GET') {
    try {
      const locacoes = await prisma.locacao.findMany({
        include: {
          usuario: true,
          veiculo: true
        }
      })
      return res.status(200).json(locacoes)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Erro ao buscar locações' })
    }
  }
  if (req.method === 'PUT') {
    const {
      id,
      usuarioId,
      veiculoId,
      dataLocacao,
      dataDevolucao,
      statusLocacao,
      localDevolucao,
      localRetirada
    } = req.body
    if (!id || !usuarioId || !veiculoId || !dataLocacao || !dataDevolucao || !statusLocacao) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' })
    }
    try {
      const locacaoAtualizada = await prisma.locacao.update({
        where: { id },
        data: {
          usuarioId,
          veiculoId,
          dataLocacao,
          dataDevolucao,
          statusLocacao,
          localDevolucao,
          localRetirada
        }
      })
      return res.status(200).json(locacaoAtualizada)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Erro ao atualizar locação' })
    }
  }
  if (req.method === 'DELETE') {
    const { id } = req.query
    if (!id) {
      return res.status(400).json({ error: 'ID da locação é obrigatório' })
    }
    try {
      const locacaoDeletada = await prisma.locacao.delete({
        where: { id: Number(id) }
      })
      return res.status(200).json(locacaoDeletada)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Erro ao deletar locação' })
    }
  }
  // Método não permitido
  res.setHeader('Allow', ['POST', 'GET', 'PUT', 'DELETE'])  
  return res.status(405).json({ error: `Método ${req.method} não permitido` })
}
