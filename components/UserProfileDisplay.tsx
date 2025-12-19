import React from 'react';
import { User } from 'firebase/auth'; // Assuming User type is from firebase/auth

interface UserProfileDisplayProps {
  user: User;
}

const UserProfileDisplay: React.FC<UserProfileDisplayProps> = ({ user }) => {
  return (
    <div className="user-profile-container">
      {/* Phần Text: Tên và Email */}
      <div className="user-info">
        <span className="user-name">{user.displayName || "Sinh viên"}</span>
        <span className="user-email">{user.email || "student@ftu.edu.vn"}</span>
      </div>

      {/* Phần Avatar */}
      <div className="user-avatar">
        {/* Nếu user có ảnh thì hiện ảnh, không thì hiện chữ cái đầu */}
        {user.photoURL ? (
          <img src={user.photoURL} alt="Avatar" />
        ) : (
          <span className="avatar-placeholder">
            {user.displayName ? user.displayName.charAt(0).toUpperCase() : "U"}
          </span>
        )}
      </div>
    </div>
  );
};

export default UserProfileDisplay;
