import type { NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { verificarToken, NextApiRequestComUsuario } from '@/utils/auth'; // ALTERADO
import bcrypt from 'bcryptjs'; // ALTERADO: Importado para criptografar a senha na atualização

const prisma = new PrismaClient();

async function handler(req: NextApiRequestComUsuario, res: NextApiResponse) { // ALTERADO
  // ADICIONADO: Extrai o tipo de usuário do token para todas as requisições nesta rota
  const { tipoUsuario, id: idDoUsuarioNoToken } = req.usuario as { id: number, tipoUsuario: string };
  
  // ADICIONADO: Apenas administradores podem acessar qualquer método desta rota
  if (tipoUsuario !== 'ADMIN') {
    return res.status(403).json({ error: 'Acesso negado. Rota apenas para administradores.' });
  }

  if (req.method === 'POST') {
    const {
      nome,
      email,
      senha,
      cpf,
      telefone,
      endereco,
      tipoUsuario: tipoUsuarioBody, // renomeado para evitar conflito
      cnh
    } = req.body;

    if (!nome || !email || !senha || !cpf || !telefone || !endereco || !tipoUsuarioBody || !cnh) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    try {
      const usuarioExistente = await prisma.usuario.findFirst({
        where: { OR: [{ email }, { cpf }] }
      });

      if (usuarioExistente) {
        return res.status(409).json({ error: 'Usuário já existe' });
      }

      // ADICIONADO: Criptografar a senha ao criar por esta rota também
      const senhaHash = await bcrypt.hash(senha, 10);

      const novoUsuario = await prisma.usuario.create({
        data: {
          nome,
          email,
          senha: senhaHash, // ALTERADO: Salva a senha criptografada
          cpf,
          telefone,
          endereco,
          tipoUsuario: tipoUsuarioBody,
          cnh
        }
      });

      return res.status(201).json(novoUsuario);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao cadastrar usuário' });
    }
  }

  if (req.method === 'GET') {
    try {
      const usuarios = await prisma.usuario.findMany();
      return res.status(200).json(usuarios);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
  }

  if (req.method === 'PUT') {
    const { id, nome, email, senha, cpf, telefone, endereco, tipoUsuario: tipoUsuarioBody, cnh } = req.body;

    if (!id || !nome || !email || !cpf || !telefone || !endereco || !tipoUsuarioBody || !cnh) {
      return res.status(400).json({ error: 'Todos os campos, exceto a senha, são obrigatórios' });
    }

    try {
      // ADICIONADO: Se uma nova senha for fornecida, criptografa antes de salvar
      const dadosParaAtualizar: any = { nome, email, cpf, telefone, endereco, tipoUsuario: tipoUsuarioBody, cnh };
      if (senha) {
        dadosParaAtualizar.senha = await bcrypt.hash(senha, 10);
      }

      const usuarioAtualizado = await prisma.usuario.update({
        where: { id },
        data: dadosParaAtualizar
      });

      return res.status(200).json(usuarioAtualizado);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao atualizar usuário' });
    }
  }

  if (req.method === 'DELETE') {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'ID do usuário é obrigatório' });
    }

    try {
      await prisma.usuario.delete({
        where: { id }
      });

      return res.status(204).end();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao deletar usuário' });
    }
  }
}

export default verificarToken(handler); // ALTERADO: Protege a rota inteira