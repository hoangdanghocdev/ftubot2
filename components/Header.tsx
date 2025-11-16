import React, { useState, useRef, useEffect } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { GoogleIcon } from "./icons";
import { signInWithGoogle, signOutUser } from "../services/authService"; // Giả sử các hàm này vẫn tồn tại
import { auth } from "../services/firebase"; // Import auth instance
import UserCard from "./UserCard"; // Import UserCard component

interface HeaderProps {
  isLoggedIn: boolean;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn }) => {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [isUserCardVisible, setIsUserCardVisible] = useState(false);
  const userCardRef = useRef<HTMLDivElement>(null);

  // Lắng nghe thay đổi trạng thái auth để cập nhật user object
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Đóng thẻ user khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userCardRef.current &&
        !userCardRef.current.contains(event.target as Node)
      ) {
        setIsUserCardVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="flex items-center justify-between p-4 bg-black border-b border-gray-800">
      <div className="flex items-center gap-3">
        <img src="logo/FTU-logo.png" alt="FTU Logo" className="w-8 h-8" />
        <h1 className="text-xl font-bold text-gray-200 uppercase">
          TRƯỜNG ĐẠI HỌC NGOẠI THƯƠNG
        </h1>
      </div>
      <div className="relative" ref={userCardRef}>
        {isLoggedIn && user ? (
          <>
            <img
              src={
                user.photoURL ||
                `https://ui-avatars.com/api/?name=${user.displayName}&background=random`
              }
              alt="User Avatar"
              className="w-10 h-10 rounded-full cursor-pointer border-2 border-transparent hover:border-blue-500 transition-all"
              onClick={() => setIsUserCardVisible(!isUserCardVisible)}
              title="Mở menu người dùng"
            />
            {isUserCardVisible && (
              <UserCard
                user={user}
                onSignOut={() => {
                  signOutUser();
                  setIsUserCardVisible(false);
                }}
              />
            )}
          </>
        ) : (
          <button
            onClick={signInWithGoogle}
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            <GoogleIcon className="w-5 h-5" />
            Sign In with Google
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
