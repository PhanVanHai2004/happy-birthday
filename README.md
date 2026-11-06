

Website sinh nhật

## Chạy thử

Mở `index.html` bằng trình duyệt, hoặc phục vụ thư mục này bằng một HTTP server. Không cần cài thư viện, backend hay bước build.

## Tính năng

- Thiệp bánh kem dâu minh họa bằng SVG và nến chuyển động.
- Mở quà, đọc thư, nhập điều ước và bấm thổi nến.
- Nến tắt và pháo giấy. Có thể ước thêm hoặc bắn pháo giấy lại.
- Những lời nhắn ngẫu nhiên, không lặp liên tiếp.
- Nhạc nhẹ tự tạo bằng Web Audio, chỉ bật khi người xem chọn.
- Responsive, hỗ trợ bàn phím và tùy chọn giảm chuyển động của thiết bị.

Điều ước không được gửi đi hoặc lưu. Không có analytics, biểu mẫu gửi dữ liệu hay tài khoản đăng nhập. Google Fonts được dùng cho kiểu chữ; khi không tải được sẽ dùng font dự phòng.

## Sửa nội dung

- `index.html`: tên, ngày sinh, tiêu đề, lời chúc cuối trang, minh họa.
- `styles.css`: màu sắc, bố cục, hiệu ứng và responsive.
- `script.js`: lá thư (`letterMarkup`), lời nhắn (`luckyMessages`), mốc đếm ngược (`birthdayStart`), nhạc và tương tác.

## GitHub Pages

Đưa các file ở thư mục này vào gốc repository. Trong Settings → Pages, chọn Deploy from a branch, nhánh `main`, thư mục `/(root)`, rồi Save. Website không cần cấu hình build.

Repository và đường link triển khai chưa được tạo trong bản thư mục này; cần kết nối tài khoản GitHub của chủ sở hữu để thực hiện.
