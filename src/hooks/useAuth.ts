import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/routes/routes';
import { toast } from 'react-toastify';

export function useAuth() {
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push(ROUTES.LOGIN);
        toast.error(`Sem permissão de acesso, Favor efetuar login`)
      }
    }
  }, [router]);

  const getToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  };
  
  const getUser = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('userId');
    }
    return null;
  };
  
  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
    }
    router.push(ROUTES.LOGIN);
  };

  return {
    getToken,
    getUser,
    logout,
  };
}
