import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse){

    if(req.method === 'POST'){
        const {
            nome,
            email,
            senha,
            cpf,
            telefone, 
            endereco, 
            tipoUsuario,
            cnh 
        } = req.body;

        if(!nome || !email || !senha || !cpf || !telefone || !endereco || !tipoUsuario || !cnh){
            return res.status(400).json({error: 'Todos os campos são obrigatórios'})
        }

        try{
            const usuarioExistente = await prisma.usuario.findFirst({
                where:{
                    OR: [{email}, {cpf}]
                }
            })

            if(usuarioExistente){
                return res.status(409).json({error: 'Usuário já existe'})
            }

            const senhaHash = await bcrypt.hash(senha, 10)

            const novoUsuario = await prisma.usuario.create({
                data:{
                    nome,
                    email,
                    senha: senhaHash,
                    cpf,
                    telefone,
                    endereco,
                    tipoUsuario,
                    cnh
                }
            })

            return res.status(201).json(novoUsuario)


        } catch(error){
            console.error(error)
            return res.status(500).json({error: 'Erro ao cadastrar usuário'})
      }
        
    }

}