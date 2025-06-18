import type { NextApiResponse } from 'next'; // ALTERADO
import { PrismaClient } from '@prisma/client';
import { verificarToken, NextApiRequestComUsuario } from '@/utils/auth'; // ALTERADO

const prisma = new PrismaClient();

export default verificarToken(async function handler(req: NextApiRequestComUsuario, res: NextApiResponse) { // ALTERADO

    // ADICIONADO: Extrai o ID e o tipo de usuário do token
    const { id: usuarioId, tipoUsuario } = req.usuario as { id: number, tipoUsuario: string };

    if (req.method === 'POST'){
        const{
            locacaoId,
            metodoPagamento,
        } = req.body;

        // ALTERADO: Simplificado, pois o status e valor são automáticos
        if(!locacaoId || !metodoPagamento){
            return res.status(400).json({error: 'ID da locação e método de pagamento são obrigatórios'})
        }

        try{
            // ADICIONADO: Verifica se a locação pertence ao usuário que está tentando pagar (ou se é ADMIN)
            const locacao = await prisma.locacao.findUnique({
                where: { id: locacaoId }
            });

            if(!locacao){
                return res.status(404).json({error: 'Locação não encontrada'});
            }

            if(locacao.usuarioId !== usuarioId && tipoUsuario !== 'ADMIN') {
                return res.status(403).json({ error: 'Acesso negado. Você só pode pagar por suas próprias locações.' });
            }
            // FIM DO BLOCO ADICIONADO

            const pagamentoExistente = await prisma.pagamento.findFirst({
                where:{
                    locacaoId,
                    statusPagamento: 'PENDENTE'
                }
            });

            if(pagamentoExistente){
                return res.status(409).json({error: 'Pagamento pendente já existente para esta locação'});
            }
            
            const novoPagamento = await prisma.pagamento.create({
                data:{
                    locacaoId,
                    valor: locacao.valorTotal, // ALTERADO: Valor vem direto da locação para consistência
                    dataPagamento: new Date(), // ALTERADO: Data do pagamento é a data atual
                    metodoPagamento,
                    statusPagamento: 'PAGO' // ALTERADO: Assume-se que a tentativa de POST é um pagamento sendo efetuado
                }
            });

            return res.status(201).json(novoPagamento);
        }

        catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro ao cadastrar pagamento' });
        }
    }

    if (req.method === 'GET') {
        try {
            // ADICIONADO: Regra para que clientes vejam apenas seus pagamentos e admins vejam todos
            const where = tipoUsuario === 'ADMIN' 
                ? {} 
                : { locacao: { usuarioId: usuarioId } };

            const pagamentos = await prisma.pagamento.findMany({
                where,
                include: { locacao: true } // Inclui dados da locação para contexto
            });
            return res.status(200).json(pagamentos);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro ao buscar pagamentos' });
        }
    }

    // ADICIONADO: Proteção para que apenas ADMINS possam modificar ou deletar pagamentos
    if (req.method === 'PUT' || req.method === 'DELETE') {
        if (tipoUsuario !== 'ADMIN') {
            return res.status(403).json({ error: 'Acesso negado. Apenas administradores podem realizar esta operação.' });
        }
    }
    // FIM DO BLOCO ADICIONADO

    if (req.method === 'PUT') { 
        const {
            id,
            locacaoId,
            valor,
            dataPagamento,
            metodoPagamento,
            statusPagamento
        } = req.body;
        if (!id || !locacaoId || !valor || !dataPagamento || !metodoPagamento || !statusPagamento) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
        }
        try {
            const pagamentoAtualizado = await prisma.pagamento.update({
                where: { id },
                data: { locacaoId, valor, dataPagamento, metodoPagamento, statusPagamento }
            });
            return res.status(200).json(pagamentoAtualizado);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro ao atualizar pagamento' });
        }
    }
    if (req.method === 'DELETE') {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ error: 'ID é obrigatório' });
        }
        try {
            await prisma.pagamento.delete({
                where: { id }
            });
            return res.status(204).end();
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro ao deletar pagamento' });
        }
    }

});