import React, { useState, useRef, useEffect } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { GoogleIcon } from "./icons";
import { signInWithGoogle, signOutUser } from "../services/authService";
import { auth } from "../services/firebase";
import UserCard from "./UserCard";
import PersonaSelector from "./PersonaSelector";
import UserProfileDisplay from "./UserProfileDisplay";

const Header: React.FC = () => {
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
    <header
      className="flex items-center justify-between p-4 border-b"
      style={{
        backgroundColor: 'var(--bg-primary)',
        borderColor: 'var(--border-color)',
      }}
    >
      <div className="flex items-center gap-3">
        <img src="logo/FTU-logo.png" alt="FTU Logo" className="w-8 h-8" />
        <h1 className="text-xl font-bold uppercase" style={{ color: 'var(--ftu-red)' }}>
          TRƯỜNG ĐẠI HỌC NGOẠI THƯƠNG
        </h1>
      </div>
      <div className="flex items-center gap-3">
        {user ? (
          <>
            <UserProfileDisplay user={user} />
            <button
              onClick={signOutUser}
              className="px-4 py-2 text-sm font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--ftu-red)] transition-colors"
              style={{
                backgroundColor: 'var(--ftu-red)',
                color: 'white',
              }}
            >
              Sign Out
            </button>
          </>
        ) : (
          <button
            onClick={signInWithGoogle}
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--ftu-red)] transition-colors"
            style={{
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)',
            }}
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
