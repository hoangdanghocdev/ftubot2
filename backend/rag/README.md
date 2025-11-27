# RAG Knowledge Base

Thư mục này chứa các file văn bản (.txt) chứa thông tin context mà model sẽ sử dụng để trả lời câu hỏi.

## Cách sử dụng

1. **Thêm file .txt mới**: Tạo file `.txt` trong thư mục này với nội dung bạn muốn model tham khảo
2. **Định dạng**: Mỗi file sẽ được tự động load và kết hợp vào system prompt
3. **Tên file**: Tên file sẽ được hiển thị trong context để dễ theo dõi

## Ví dụ

- `ftu-info.txt` - Thông tin về trường Đại học Ngoại thương
- `admissions.txt` - Thông tin tuyển sinh
- `programs.txt` - Các chương trình đào tạo
- `regulations.txt` - Quy định và nội quy

## Lưu ý

- Chỉ các file `.txt` mới được load
- Nội dung sẽ được cache trong 5 phút để tối ưu hiệu suất
- Thứ tự file được sắp xếp theo tên (alphabetical)
- Mỗi file sẽ được phân cách bằng `--- filename ---`

## Cách cập nhật

1. Chỉnh sửa hoặc thêm file .txt trong thư mục này
2. Restart server để load nội dung mới (hoặc đợi 5 phút để cache hết hạn)

