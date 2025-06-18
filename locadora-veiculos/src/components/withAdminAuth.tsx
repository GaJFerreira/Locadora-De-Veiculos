import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';

// Este é um Componente de Ordem Superior (Higher-Order Component - HOC)
const withAdminAuth = (WrappedComponent: React.ComponentType) => {
  const Wrapper = (props: any) => {
    const { isAuthenticated, user, isLoading } = useAuth(); // Adicionamos isLoading ao useAuth
    const router = useRouter();

    useEffect(() => {
      // Se não estiver carregando e o usuário não for um admin autenticado, redireciona
      if (!isLoading && (!isAuthenticated || user?.tipoUsuario !== 'ADMIN')) {
        router.push('/login'); // Redireciona para o login se não for admin
      }
    }, [isAuthenticated, user, isLoading, router]);

    // Mostra uma mensagem de carregamento enquanto o estado de auth é verificado
    if (isLoading || !isAuthenticated || user?.tipoUsuario !== 'ADMIN') {
      return <p>Verificando permissões...</p>;
    }

    // Se for admin, renderiza o componente da página
    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default withAdminAuth;