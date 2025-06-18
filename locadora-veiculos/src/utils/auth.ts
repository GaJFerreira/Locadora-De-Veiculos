// ALTERADO: Conteúdo completo adicionado para criar o middleware de verificação de token.
import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import jwt from 'jsonwebtoken';

// Esta é uma interface para estender o objeto NextApiRequest e adicionar a propriedade 'usuario'
export interface NextApiRequestComUsuario extends NextApiRequest {
  usuario?: string | jwt.JwtPayload;
}

// Este é o nosso middleware de autenticação que "embrulha" um handler de API
export const verificarToken = (handler: NextApiHandler) => {
  return async (req: NextApiRequestComUsuario, res: NextApiResponse) => {
    
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(401).json({ error: 'Token de autenticação não fornecido.' });
    }

    // O formato do token é "Bearer SEU_TOKEN", então separamos o "Bearer" do token
    const [, token] = authorization.split(' ');

    if (!token) {
        return res.status(401).json({ error: 'Formato de token inválido.' });
    }

    try {
      // Verifica o token usando o segredo
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
      
      // Adiciona o payload decodificado (com id e tipoUsuario) ao objeto da requisição
      req.usuario = decoded;

      // Se o token for válido, chama o handler original da rota
      return handler(req, res);

    } catch (error) {
      return res.status(401).json({ error: 'Token inválido ou expirado.' });
    }
  };
};