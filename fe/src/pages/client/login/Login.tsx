import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  
import { userService } from '../../../services/UserService'; 

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>('');  
  const navigate = useNavigate();  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await userService.login(email, password);  // Gọi phương thức login từ userService
      if (user) {
        navigate('/');  
      } else {
        setError('Đăng nhập thất bại, vui lòng kiểm tra lại email hoặc mật khẩu');
      }
    } catch {
      setError('Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại.');
    }
  };

  return (
    <div>
      <h2>Đăng nhập</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>} {/* Hiển thị thông báo lỗi nếu có */}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Mật khẩu:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Đăng nhập</button>
      </form>
    </div>
  );
};

export default Login;
