import { useState, useRef, useEffect } from 'react';

const UserDropdown = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // UX: Bấm ra ngoài thì tự đóng menu
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

  // Nếu chưa đăng nhập (user null) -> Không hiện gì hoặc hiện nút Login (tùy bạn xử lý ở cha)
  if (!user) return null; 

  return (
    <div className="relative" ref={menuRef}>
      
      {/* --- TRIGGER: AVATAR --- */}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="flex items-center justify-center focus:outline-none transition-transform active:scale-95"
      >
        <img
          className={`w-10 h-10 rounded-full object-cover border-2 ${isOpen ? 'border-red-500' : 'border-transparent'} hover:border-gray-400 transition-all`}
          // Logic lấy ảnh: Ưu tiên ảnh Firebase -> Nếu không có thì dùng UI Avatars tạo ảnh theo tên
          src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || 'User'}&background=random&color=fff`}
          alt="User Avatar"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://ui-avatars.com/api/?name=${user.displayName || 'U'}&background=random`;
          }}
        />
      </button>

      {/* --- DROPDOWN MENU --- */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-[#1e1e1e] rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden transform transition-all duration-200 origin-top-right">
          
          {/* 1. Header: Thông tin tài khoản */}
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-[#252525]">
            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
              {user.displayName || "Sinh viên FTU"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">
              {user.email}
            </p>
          </div>

          {/* 2. Các mục Menu */}
          <div className="py-2">
            
            {/* Mục: Thông tin cá nhân */}
            <a href="/profile" className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              Thông tin cá nhân
            </a>

            {/* Mục: Lịch sử nộp đơn */}
            <a href="/history" className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
              Lịch sử nộp đơn
            </a>

          </div>

          {/* 3. Divider & Đăng xuất */}
          <div className="border-t border-gray-100 dark:border-gray-700 py-2">
            <button 
              onClick={() => {
                setIsOpen(false);
                onLogout(); // Gọi hàm đăng xuất từ props
              }}
              className="w-full text-left flex items-center gap-3 px-5 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              Đăng xuất
            </button>
          </div>

        </div>
      )}
    </div>
  );
};

export default UserDropdown;
