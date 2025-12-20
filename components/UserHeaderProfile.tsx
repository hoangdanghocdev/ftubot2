import { useState, useRef, useEffect } from 'react';

const UserHeaderProfile = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Xử lý click ra ngoài để đóng menu
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  if (!user) return null; // Hoặc return nút Login tùy bạn

  return (
    // Container chính: Căn hàng ngang, khoảng cách giữa chữ và ảnh là gap-3
    <div className="flex items-center gap-3" ref={menuRef}>
      
      {/* --- PHẦN 1: THÔNG TIN USER (HIỂN THỊ BÊN TRÁI AVATAR) --- */}
      <div className="hidden md:block text-right">
        <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight">
          {user.displayName || "Sinh viên FTU"}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {user.email}
        </p>
      </div>

      {/* --- PHẦN 2: AVATAR & DROPDOWN --- */}
      <div className="relative">
        
        {/* Nút bấm Avatar */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="flex items-center justify-center focus:outline-none"
        >
          <img
            className={`w-10 h-10 rounded-full object-cover border-2 transition-all ${
              isOpen ? 'border-red-500' : 'border-transparent hover:border-gray-300'
            }`}
            src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || 'U'}&background=random`}
            alt="Avatar"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://ui-avatars.com/api/?name=${user.displayName || 'U'}&background=random`;
            }}
          />
        </button>

        {/* Menu Dropdown (Chỉ hiện các tác vụ) */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#1e1e1e] rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 z-50 py-1 animate-fade-in-down">
            
            {/* Nếu màn hình điện thoại quá nhỏ (ẩn text bên ngoài) thì hiện text bên trong menu */}
            <div className="md:hidden px-4 py-2 border-b border-gray-100 dark:border-gray-700 mb-1">
               <p className="text-sm font-bold text-gray-900 dark:text-white">{user.displayName}</p>
               <p className="text-xs text-gray-500">{user.email}</p>
            </div>

            {/* Mục: Thông tin cá nhân */}
            <a href="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              Thông tin cá nhân
            </a>

            {/* Mục: Lịch sử nộp đơn */}
            <a href="/history" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Lịch sử nộp đơn
            </a>

            <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>

            {/* Mục: Đăng xuất */}
            <button 
              onClick={() => { setIsOpen(false); onLogout(); }}
              className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              Đăng xuất
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserHeaderProfile;
