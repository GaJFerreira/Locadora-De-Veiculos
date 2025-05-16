import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === 'POST'){

        const{
            locacaoId,
            valor,
            dataPagamento,
            metodoPagamento,
            statusPagamento,
        } = req.body;

        if(!locacaoId || !valor || !dataPagamento || !metodoPagamento || !statusPagamento){
            return res.status(400).json({error: 'Todos os campos são obrigatórios'})
        }

        try{
            const pagamentoExistente = await prisma.pagamento.findFirst({
                where:{
                    locacaoId,
                    statusPagamento: 'PENDENTE'
                }
            })

            if(pagamentoExistente){
                return res.status(409).json({error: 'Pagamento ja existente'})
            }

            const locacao = await prisma.locacao.findUnique({
                where: { id: locacaoId }
            })

            if(!locacao){
                return res.status(404).json({error: 'Locação não encontrada'})
            }

            const valorTotal = locacao?.valorTotal || 0;

            const novoPagamento = await prisma.pagamento.create({
                data:{
                    locacaoId,
                    valor: valorTotal,
                    dataPagamento,
                    metodoPagamento,
                    statusPagamento
                }
            })

            return res.status(201).json(novoPagamento)
        }

        catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro ao cadastrar pagamento' });
        }
    }

    if (req.method === 'GET') {
        try {
            const pagamentos = await prisma.pagamento.findMany();
            return res.status(200).json(pagamentos);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro ao buscar pagamentos' });
        }
    }
    if (req.method === 'PUT') { 
        const {
            id,
            locacaoId,
            valor,
            dataPagamento,
            metodoPagamento,
            statusPagamento
        } = req.body
        if (!id || !locacaoId || !valor || !dataPagamento || !metodoPagamento || !statusPagamento) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios' })
        }
        try {
            const pagamentoAtualizado = await prisma.pagamento.update({
                where: { id },
                data: {
                    locacaoId,
                    valor,
                    dataPagamento,
                    metodoPagamento,
                    statusPagamento
                }
            })
            return res.status(200).json(pagamentoAtualizado)
        } catch (error) {
            console.error(error)
            return res.status(500).json({ error: 'Erro ao atualizar pagamento' })
        }
    }
    if (req.method === 'DELETE') {
        const { id } = req.body
        if (!id) {
            return res.status(400).json({ error: 'ID é obrigatório' })
        }
        try {
            await prisma.pagamento.delete({
                where: { id }
            })
            return res.status(204).end()
        } catch (error) {
            console.error(error)
            return res.status(500).json({ error: 'Erro ao deletar pagamento' })
        }
    }

}