import React, { useEffect, useState } from 'react';
import { clientService } from '../../../services/clientService';

const Profile: React.FC = () => {
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const userId = 'USER_ID'; // Thay bằng id thực tế
      const profile = await clientService.getUserProfile(userId);
      setUserProfile(profile);
    };

    fetchProfile();
  }, []);

  if (!userProfile) {
    return <div>Đang tải...</div>;
  }

  return (
    <div>
      <h2>Thông tin tài khoản</h2>
      <p><strong>Họ và tên:</strong> {userProfile.fullName}</p>
      <p><strong>Email:</strong> {userProfile.email}</p>
      <p><strong>Trạng thái:</strong> {userProfile.isActive ? 'Hoạt động' : 'Ngưng'}</p>
    </div>
  );
};

export default Profile;
