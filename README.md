# FTU AI Chatbot

Một ứng dụng chatbot dành cho sinh viên và những người quan tâm đến trường Đại học Ngoại thương (FTU), được xây dựng bằng React và Vite. Chatbot được tích hợp AI của Google Gemini để cung cấp các câu trả lời thông minh và tự nhiên. Toàn bộ phần backend được xử lý bởi Firebase, bao gồm xác thực người dùng và lưu trữ dữ liệu.
This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/18ec7ojxLjU9948RKAKNY5_zfkxbnKgaI

- **Giao diện Chat Hiện đại:** Trải nghiệm trò chuyện mượt mà và trực quan.
- **AI Thông minh:** Tích hợp Google Gemini để trả lời các câu hỏ- **Xác thực người dùng:** Hỗ trợ đăng nhập, đăng ký để cá nhân hóa trải nghiệm.
  ò chuyện:\*\* Lưu trữ các cuộc hội thoại bằng Cloud Firestore.
- **Nền tảng Web:** Dễ

## 🚀 Công nghệ sử dụng

**Prerequisites:** Node.js thư viện UI/CSS bạn dùng ở đây, ví dụ: Tailwind CSS, Material-UI...)
mple .env.local`

```
GEMINI_API_KEY=YOUR_API_KEY_HERE
```

3. Run the app:
   `npm run dev`

## ⚙️ Cài đặt và Chạy dự án

### Yêu cầu

- Node.js (phiên bản 18.x trở lên)
- `npm` hoặc `yarn`

### Các bước cài đặt

1.  **Clone repository về máy:**

    ```bash
    git clone <your-repository-url>
    cd ftu-ai-chatbot
    ```

2.  **Cài đặt các dependencies:**

    ```bash
    npm install
    ```

3.  **Cấu hình biến môi trường:**

    Tạo một tệp tin có tên là `.env` ở thư mục gốc của dự án và thêm các khóa API cần thiết.

    Bạn có thể lấy các giá trị này từ **Firebase Project Settings** và **Google AI Studio**.

    ```env
    # Khóa API cho Google Gemini
    GEMINI_API_KEY=YOUR_GEMINI_API_KEY

    # Cấu hình Firebase (lấy từ Firebase Console)
    VITE_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
    VITE_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
    VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
    VITE_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
    VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
    VITE_FIREBASE_APP_ID=YOUR_APP_ID
    ```

4.  **Chạy server phát triển:**

    Lệnh này sẽ khởi động ứng dụng trên `http://localhost:3000`.

    ```bash
    npm run dev
    ```

## 📦 Build ứng dụng

Để tạo phiên bản production cho ứng dụng, chạy lệnh sau:

```bash
npm run build
```

Lệnh này sẽ tạo một thư mục `dist` chứa các tệp tĩnh đã được tối ưu hóa, sẵn sàng để bạn triển khai lên các dịch vụ hosting.

## 🌐 Triển khai (Deployment)

Bạn có thể dễ dàng triển khai thư mục `dist` lên các nền tảng hosting cho ứng dụng tĩnh như:

- Firebase Hosting
- Vercel
- Netlify

---

Chúc bạn có những trải nghiệm tuyệt vời với dự án!
