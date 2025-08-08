import { useMutation } from '@tanstack/react-query';
import { API_SERVICE } from './api_service';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { useAuth } from '../components/AuthContext';

export const useAuthen = (resource: string) => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const authMutation = useMutation({
    mutationFn: async ({ email, password, fullName }: { email: string; password: string, fullName?: string }) => {
      if (resource === 'login') {
        return await API_SERVICE.auth.login({ email, password });
      }
      if (resource === 'register') {
        return await API_SERVICE.auth.register({ email, password, fullName: fullName || '' });
      }
      throw new Error("Method không hợp lệ");
    },
    onSuccess: (data) => {
      login(data);
      if (resource === "register") {
        message.success("Đăng ký thành công");
      } else if (resource === "login") {
        const role = data?.user?.role;
        if (role === "customer") {
          navigate("/");
        } else if (role === "admin" || role === "staff") {
          navigate("/admin");
        } else {
          navigate("/login");
        }
        message.success("Đăng nhập thành công");
        localStorage.setItem("token", data.accessToken);
      }
    },
    onError: () => {
      if (resource === "register") {
        message.warning("Đăng ký thất bại, vui lòng kiểm tra lại email hoặc mật khẩu");
        return;
      } else if (resource === "login") {
        message.warning('Đăng nhập thất bại, vui lòng kiểm tra lại email hoặc mật khẩu');
      }
    }
  });
  return authMutation;
}
