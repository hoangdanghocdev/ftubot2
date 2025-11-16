import React, { useState } from "react";
import { User } from "firebase/auth";
import { LogoutIcon, ProcessIcon } from "./icons";

interface UserCardProps {
  user: User;
  onSignOut: () => void;
}

type FormStatus = "Chưa gửi" | "Đang xử lý..." | "Đã hoàn tất" | "Lỗi";

interface PopupResult {
  type: "success" | "error";
  message: string;
}

const UserCard: React.FC<UserCardProps> = ({ user, onSignOut }) => {
  const [formStatus, setFormStatus] = useState<FormStatus>("Chưa gửi");
  const [popupResult, setPopupResult] = useState<PopupResult | null>(null);

  /**
   * Bắt đầu quy trình xử lý form.
   * - Cập nhật trạng thái sang "Đang xử lý...".
   * - Mô phỏng một tác vụ bất đồng bộ (ví dụ: gọi API, xử lý dữ liệu).
   * - Sau khi hoàn tất, hiển thị popup kết quả.
   */
  const handleProcessForm = async () => {
    setFormStatus("Đang xử lý...");

    // --- BẮT ĐẦU LOGIC XỬ LÝ FORM CỦA BẠN TẠI ĐÂY ---
    // Ví dụ: Mở một modal, thu thập dữ liệu, và gửi lên server.
    // Dưới đây là một ví dụ mô phỏng việc xử lý mất 2 giây.
    await new Promise((resolve) => setTimeout(resolve, 2000));
    // --- KẾT THÚC LOGIC XỬ LÝ FORM ---

    // Sau khi xử lý xong, nhận kết quả và hiển thị popup
    const isSuccess = Math.random() > 0.3; // Mô phỏng kết quả thành công/thất bại
    if (isSuccess) {
      setFormStatus("Đã hoàn tất");
      showResultPopup({
        type: "success",
        message: "Tác vụ đã được xử lý thành công!",
      });
    } else {
      setFormStatus("Lỗi");
      showResultPopup({
        type: "error",
        message: "Đã có lỗi xảy ra. Vui lòng thử lại.",
      });
    }
  };

  /**
   * Xử lý đăng xuất người dùng.
   */
  const handleSignOut = () => {
    onSignOut();
  };

  /**
   * Hiển thị popup kết quả.
   * @param result - Đối tượng chứa loại và nội dung thông báo.
   */
  const showResultPopup = (result: PopupResult) => {
    setPopupResult(result);
  };

  const closePopup = () => {
    setPopupResult(null);
  };

  return (
    <div className="absolute top-full right-0 mt-2 w-80 bg-gray-900 border border-gray-700 rounded-lg shadow-lg p-4 z-50 text-white">
      {/* Phần thông tin cá nhân */}
      <div className="flex items-center mb-4">
        <img
          src={
            user.photoURL ||
            `https://ui-avatars.com/api/?name=${user.displayName}&background=random`
          }
          alt="User Avatar"
          className="w-16 h-16 rounded-full mr-4 border-2 border-gray-600"
        />
        <div>
          <p className="font-semibold text-lg truncate">
            {user.displayName || "User"}
          </p>
          <p className="text-sm text-gray-400 truncate">{user.email}</p>
        </div>
      </div>

      {/* Phần các nút hành động */}
      <div className="space-y-3">
        <button
          onClick={handleProcessForm}
          disabled={formStatus === "Đang xử lý..."}
          className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          <ProcessIcon className="w-5 h-5 mr-2" />
          Xử lý Tác vụ
        </button>
        <div className="text-center text-xs text-gray-400">
          Trạng thái:{" "}
          <span className="font-medium text-gray-300">{formStatus}</span>
        </div>

        <div className="border-t border-gray-700 my-2"></div>

        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md transition-colors"
        >
          <LogoutIcon className="w-5 h-5 mr-2" />
          Đăng xuất
        </button>
      </div>

      {/* Popup hiển thị kết quả */}
      {popupResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className={`p-6 rounded-lg shadow-xl max-w-sm mx-auto ${
              popupResult.type === "success" ? "bg-green-800" : "bg-red-800"
            }`}
          >
            <h3 className="text-lg font-bold mb-2">
              {popupResult.type === "success" ? "Thành công" : "Lỗi"}
            </h3>
            <p className="text-gray-200 mb-4">{popupResult.message}</p>
            <button
              onClick={closePopup}
              className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-md transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserCard;
