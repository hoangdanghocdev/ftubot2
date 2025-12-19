import React from "react";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import { User } from "firebase/auth";

interface HeaderProps {
  isLoggedIn: boolean;
  selectedPersonaId: string | null;
  onPersonaChange: (personaId: string) => void;
  activeFeature: "chat" | "forms" | "audio";
  onFeatureChange: (feature: "chat" | "forms" | "audio") => void;
  // Các props dưới đây có thể không được truyền từ App.tsx hiện tại,
  // nhưng chúng ta thêm vào để code mới hoạt động mà không gây lỗi.
  user?: User | null;
  isDarkMode?: boolean;
  toggleDarkMode?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  isLoggedIn,
  user,
  isDarkMode,
  toggleDarkMode,
  onFeatureChange,
  activeFeature,
}) => {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  // Đăng nhập
  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
    }
  };

  // Đăng xuất
  const handleSignOut = async () => {
    // Thêm log để kiểm tra xem nút có bấm được không
    console.log("Đang bấm nút đăng xuất...");
    if (window.confirm("Bạn muốn đăng xuất?")) {
      try {
        await signOut(auth);
        window.location.reload();
      } catch (error) {
        console.error("Lỗi đăng xuất:", error);
      }
    }
  };

  return (
    <div
      className={`header-container ${isDarkMode ? "dark" : "light"}`}
      // THÊM: Style inline để ép Header nổi lên trên cùng
      style={{
        position: "relative",
        zIndex: 9999,
      }}
    >
      {/* Logo */}
      <div className="header-left">
        <span
          className="school-name"
          style={{ fontWeight: "bold", fontSize: "18px" }}
        >
          TRƯỜNG ĐẠI HỌC NGOẠI THƯƠNG
        </span>
      </div>

      {/* User Info */}
      <div
        className="header-right"
        style={{ display: "flex", alignItems: "center", gap: "15px" }}
      >
        {toggleDarkMode && (
          <button className="theme-toggle-btn" onClick={toggleDarkMode}>
            {isDarkMode ? "☀️" : "🌙"}
          </button>
        )}

        {isLoggedIn && user ? (
          // --- GIAO DIỆN ĐÃ ĐĂNG NHẬP ---
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {/* Thông tin User */}
            <div
              style={{
                textAlign: "right",
                padding: "5px 10px",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <div>
                <div style={{ fontWeight: "bold", fontSize: "13px" }}>
                  {user.displayName}
                </div>
                <div style={{ fontSize: "11px", opacity: 0.7 }}>
                  {user.email}
                </div>
              </div>
              <img
                src={user.photoURL || undefined} // Added || undefined for type safety
                alt="Avatar"
                style={{ width: "35px", height: "35px", borderRadius: "50%" }}
              />
            </div>

            {/* --- NÚT ĐĂNG XUẤT (TEXT) --- */}
            {/* Dùng nút chữ to rõ ràng, không dùng icon để tránh lỗi hiển thị */}
            <button
              onClick={handleSignOut}
              style={{
                backgroundColor: "#d32f2f" /* Màu đỏ */,
                color: "white",
                border: "none",
                padding: "8px 15px",
                borderRadius: "5px",
                cursor: "pointer" /* Hiện bàn tay */,
                fontWeight: "bold",
                fontSize: "13px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
              }}
            >
              ĐĂNG XUẤT
            </button>
          </div>
        ) : (
          // --- NÚT ĐĂNG NHẬP ---
          <button
            className="login-btn"
            onClick={handleSignIn}
            style={{
              padding: "8px 15px",
              cursor: "pointer",
              borderRadius: "20px",
              fontWeight: "bold",
            }}
          >
            Sign in with Google
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;
