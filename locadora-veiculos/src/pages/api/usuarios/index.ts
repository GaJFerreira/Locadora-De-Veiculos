import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();//Inicializa o Prisma para acessar o banco de dados
// PrismaClient é uma classe que fornece uma interface para interagir com o banco de dados usando o Prisma ORM
                 

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
        } = req.body;

        if (!nome || !email || !senha || !cpf || !telefone || !endereco || !tipoUsuario || !cnh) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
        }

    } else{
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Metodo ${req.method} não permitido`);
    }
}