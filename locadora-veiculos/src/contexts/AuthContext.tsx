import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import jwt from 'jsonwebtoken';

// Define a interface para os dados do usuário que virão do token
interface User {
  id: number;
  tipoUsuario: 'ADMIN' | 'CLIENTE';
}

// Define a interface para o valor do nosso contexto
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

// Cria o contexto com um valor padrão
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Cria o Provedor do Contexto
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Efeito para carregar o token do localStorage ao iniciar a aplicação
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decoded = jwt.decode(token) as User;
        if (decoded) {
          setUser({ id: decoded.id, tipoUsuario: decoded.tipoUsuario });
        }
      } catch (error) {
        console.error("Erro ao decodificar token:", error);
        logout();
      }
    }
    setIsLoading(false); 
  }, []);

  const login = (token: string) => {
    try {
      const decoded = jwt.decode(token) as User;
      if (decoded) {
        localStorage.setItem('authToken', token);
        setUser({ id: decoded.id, tipoUsuario: decoded.tipoUsuario });
      }
    } catch (error) {
      console.error("Erro ao decodificar token no login:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  const authContextValue = {
    isAuthenticated: !!user,
    user,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook customizado para facilitar o uso do contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};