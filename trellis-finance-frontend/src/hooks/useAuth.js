import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { login as loginApi, register as registerApi } from '../services/authService';

export function useAuth() {
  const navigate = useNavigate();
  const { token, user, login: storeLogin, logout: storeLogout } = useAuthStore();

  const login = async (email, password) => {
    const res = await loginApi(email, password);
    storeLogin(res.data);
    navigate('/dashboard');
    return res.data;
  };

  const register = async data => {
    const res = await registerApi(data);
    storeLogin(res.data);
    navigate('/dashboard');
    return res.data;
  };

  const logout = () => {
    storeLogout();
    navigate('/login');
  };

  return { isAuthenticated: !!token, user, token, login, register, logout };
}
