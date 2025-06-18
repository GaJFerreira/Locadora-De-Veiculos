import type { NextApiResponse } from 'next'; // ALTERADO: NextApiRequest removido para dar lugar à nossa interface
import { PrismaClient } from '@prisma/client';
import { verificarToken, NextApiRequestComUsuario } from '@/utils/auth'; // ALTERADO: Adicionada a importação do nosso middleware

const prisma = new PrismaClient();

async function handler(req: NextApiRequestComUsuario, res: NextApiResponse) { // ALTERADO: Tipagem do 'req' atualizada
    
    if (req.method === 'POST') {
        // ADICIONADO: Bloco para verificar se o usuário tem permissão de ADMIN
        const { tipoUsuario } = req.usuario as { tipoUsuario: string };
        if (tipoUsuario !== 'ADMIN') {
            return res.status(403).json({ error: 'Acesso negado. Apenas administradores podem cadastrar veículos.' });
        }
        // FIM DO BLOCO ADICIONADO

        const {
            modelo,
            marca,
            ano,
            cor,
            placa,
            renavam,
            chasis,
            quilometragem,
            valorFipe,
            tipoVeiculo,
        } = req.body;
        if (!modelo || !marca || !ano || !cor || !placa || !renavam || !chasis || !quilometragem || !valorFipe || !tipoVeiculo) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
        }
        try {
            const veiculoExistente = await prisma.veiculo.findUnique({
                where: { placa },
            });
            if (veiculoExistente) {
                return res.status(409).json({ error: 'Veículo já existe' });
            }

            const novoVeiculo = await prisma.veiculo.create({
                data: {
                    modelo,
                    marca,
                    ano,
                    cor,
                    placa,
                    renavam,
                    chasis,
                    quilometragem,
                    valorFipe,
                    tipoVeiculo,
                },
            });
            return res.status(201).json(novoVeiculo);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro ao cadastrar veículo' });
        }   

    }

    if (req.method === 'GET') {
        try {
            const veiculos = await prisma.veiculo.findMany();
            return res.status(200).json(veiculos);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro ao buscar veículos' });
        }
    }

    if(req.method === 'PUT'){
        // ADICIONADO: Verificação de permissão de ADMIN para atualizar
        const { tipoUsuario } = req.usuario as { tipoUsuario: string };
        if (tipoUsuario !== 'ADMIN') {
            return res.status(403).json({ error: 'Acesso negado. Apenas administradores podem atualizar veículos.' });
        }
        // FIM DO BLOCO ADICIONADO

        const{
            id,
            modelo,
            marca,
            ano,
            cor,
            placa,
            renavam,
            chasis,
            quilometragem,
            valorFipe,
            tipoVeiculo 
        } = req.body
        if (!id || !modelo || !marca || !ano || !cor || !placa || !renavam || !chasis || !quilometragem || !valorFipe || !tipoVeiculo) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
        }
        try {
            const veiculoAtualizado = await prisma.veiculo.update({ 
                where: { id },
                data: {
                    modelo,
                    marca,
                    ano,
                    cor,
                    placa,
                    renavam,
                    chasis,
                    quilometragem,
                    valorFipe,
                    tipoVeiculo
                }
            })
            return res.status(200).json(veiculoAtualizado)
        } catch (error) {
            console.error(error)
            return res.status(500).json({ error: 'Erro ao atualizar veículo' })
        }
    }

    if (req.method === 'DELETE') {
        // ADICIONADO: Verificação de permissão de ADMIN para deletar
        const { tipoUsuario } = req.usuario as { tipoUsuario: string };
        if (tipoUsuario !== 'ADMIN') {
            return res.status(403).json({ error: 'Acesso negado. Apenas administradores podem deletar veículos.' });
        }
        // FIM DO BLOCO ADICIONADO

        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ error: 'ID do veículo é obrigatório' });
        }
        try {
            await prisma.veiculo.delete({
                where: { id },
            });
            return res.status(204).end();
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro ao deletar veículo' });
        }
    }
        
}

export default verificarToken(handler); // ALTERADO: Exporta o handler protegido pelo middleware