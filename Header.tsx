import React from 'react';
import { getAuth, signOut } from "firebase/auth";
import { useTheme } from "./ThemeContext"; // QUAN TRỌNG: Phải import dòng này

function Header({ user }) {
  const auth = getAuth(); // Khởi tạo auth
  const { theme, toggleTheme } = useTheme(); // Use the theme hook

  // Hàm xử lý đăng xuất
  const handleSignOut = async () => {
    const confirmLogout = window.confirm("Bạn có chắc chắn muốn đăng xuất?");
    if (confirmLogout) {
      try {
        await signOut(auth);
        console.log("Đã đăng xuất thành công");
        window.location.reload(); // Tải lại trang để về màn hình đăng nhập
      } catch (error) {
        console.error("Lỗi đăng xuất:", error);
        alert("Lỗi đăng xuất: " + error.message);
      }
    }
  };

  return (
    <header className={`header-container ${theme}`}>
      
      {/* 1. Logo & Tên trường */}
      <div className="header-left">
        <img src="logo-ftu.png" alt="Logo" className="logo" /> {/* Thay đường dẫn ảnh của bạn */}
        <span className="school-name">TRƯỜNG ĐẠI HỌC NGOẠI THƯƠNG</span>
      </div>

      {/* 2. Bên phải: Dark Mode + User Profile */}
      <div className="header-right">
        
        {/* Nút Chuyển chế độ Sáng/Tối */}
        <button 
            className="theme-toggle" 
            onClick={toggleTheme}
            title="Đổi giao diện"
            style={{ marginRight: '15px', cursor: 'pointer' }} // CSS inline tạm thời để căn chỉnh
        >
            {theme === 'dark' ? "☀️" : "🌙"}
        </button>

        {/* User Profile (Click vào đây để Đăng xuất) */}
        {user ? (
          <div 
            className="user-profile-container" 
            onClick={handleSignOut} // QUAN TRỌNG: Gắn sự kiện click vào đây
            title="Bấm để đăng xuất"
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
          >
            <div className="user-info" style={{ textAlign: 'right' }}>
              <div className="user-name" style={{ fontWeight: 'bold' }}>
                {user.displayName || "Sinh viên"}
              </div>
              <div className="user-email" style={{ fontSize: '12px', opacity: 0.8 }}>
                {user.email}
              </div>
            </div>
            
            <div className="user-avatar">
              {user.photoURL ? (
                <img 
                    src={user.photoURL} 
                    alt="Avatar" 
                    style={{ width: '40px', height: '40px', borderRadius: '50%' }} 
                />
              ) : (
                <div style={{ 
                    width: '40px', height: '40px', borderRadius: '50%', 
                    backgroundColor: '#ff69b4', color: 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
                }}>
                    {user.displayName?.charAt(0)}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Nút đăng nhập nếu chưa có user */
          <button className="login-btn">Đăng nhập</button>
        )}
      </div>
    </header>
  );
}

export default Header;
