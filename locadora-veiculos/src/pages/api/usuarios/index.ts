import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const {
      nome,
      email,
      senha,
      cpf,
      telefone,
      endereco,
      tipoUsuario,
      cnh
    } = req.body

    if (!nome || !email || !senha || !cpf || !telefone || !endereco || !tipoUsuario || !cnh) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' })
    }

    try {
      const usuarioExistente = await prisma.usuario.findUnique({
        where: { email }

      })

      if (usuarioExistente) {
        return res.status(409).json({ error: 'Usuário já existe' })
      }

      const novoUsuario = await prisma.usuario.create({
        data: {
          nome,
          email,
          senha,
          cpf,
          telefone,
          endereco,
          tipoUsuario,
          cnh
        }
      })

      return res.status(201).json(novoUsuario)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Erro ao cadastrar usuário' })
    }
  }

  if (req.method === 'GET') {
    try {
      const usuarios = await prisma.usuario.findMany()
      return res.status(200).json(usuarios)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Erro ao buscar usuários' })
    }
  }
if (req.method === 'PUT') {
    const { id, nome, email, senha, cpf, telefone, endereco, tipoUsuario, cnh } = req.body

    if (!id || !nome || !email || !senha || !cpf || !telefone || !endereco || !tipoUsuario || !cnh) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' })
    }

    try {
      const usuarioAtualizado = await prisma.usuario.update({
        where: { id },
        data: {
          nome,
          email,
          senha,
          cpf,
          telefone,
          endereco,
          tipoUsuario,
          cnh
        }
      })

      return res.status(200).json(usuarioAtualizado)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Erro ao atualizar usuário' })
    }
  }

  if (req.method === 'DELETE') {
    const { id } = req.body

    if (!id) {
      return res.status(400).json({ error: 'ID do usuário é obrigatório' })
    }

    try {
      await prisma.usuario.delete({
        where: { id }
      })

      return res.status(204).end()
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Erro ao deletar usuário' })
    }
  }

}