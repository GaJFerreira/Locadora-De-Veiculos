import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, TipoUsuario } from '@prisma/client'    
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST'){
        const{
            email,
            senha
        } = req.body;

        if(!email || !senha){
            return res.status(400).json({error: 'Email e senha são obrigatórios'})
        }

        try{
            const usuario = await prisma.usuario.findUnique({
                where: {email}
            })

            if(!usuario){
                return res.status(404).json({error: 'Usuario não encontrado'})
            }

            const senhaUsuario = await bcrypt.compare(senha, usuario.senha)

            if(!senhaUsuario){
                return res.status(401).json({error: 'Senha incorreta'})
            }

            const token = jwt.sign({
                id: usuario.id,
                tipoUsuario: usuario.tipoUsuario
            }, process.env.JWT_SECRET as string, {
                expiresIn: '1d'
            }

            )

            return res.status(200).json({ token });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro ao fazer login' });
        }

    }
    
}