import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
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