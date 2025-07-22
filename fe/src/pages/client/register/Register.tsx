import React, { useState } from 'react';
import { userService } from '../../../services/UserService';

const Register: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>('');  
  const [success, setSuccess] = useState<string>('');  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await userService.add({ fullName, email, role: 'user', isActive: true });  // Gọi phương thức add từ userService để đăng ký
      setSuccess('Đăng ký thành công! Vui lòng đăng nhập.');
      setError('');  // Reset lỗi khi đăng ký thành công
    } catch {
      setError('Đăng ký thất bại. Vui lòng thử lại.');
      setSuccess('');
    }
  };

  return (
    <div>
      <h2>Đăng ký tài khoản</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>} {/* Hiển thị thông báo lỗi nếu có */}
      {success && <div style={{ color: 'green' }}>{success}</div>} {/* Hiển thị thông báo thành công nếu có */}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Tên đầy đủ:</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>
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
        <button type="submit">Đăng ký</button>
      </form>
    </div>
  );
};

export default Register;
