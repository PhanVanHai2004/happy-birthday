# Huệ · Chuyến đi đến tuổi mới — V2

Website frontend với một hành trình sinh nhật theo cảnh, dành cho Huệ (05/11/2004), sinh nhật 22 tuổi ngày 05/11/2026.

## Xem trên máy
Giải nén toàn bộ thư mục rồi mở index.html bằng Chrome hoặc Edge. Giữ styles.css và script.js cùng thư mục với index.html. Không cần cài thư viện hay bước build.

## Hành trình
1. Màn mở đầu: nhân vật hoạt hình, quỹ đạo và lời mời bắt đầu.
2. Đường hầm ký ức: 6 giai đoạn với tranh minh họa riêng. Tự chạy khoảng 46 giây; có thể dừng, tiếp tục, chọn năm, chuyển chặng hoặc đến cửa ngay.
3. Cánh cửa tuổi mới: cửa hai cánh mở, nhân vật đi vào ánh sáng rồi tới căn phòng sinh nhật.
4. Bánh kem hai tầng: 5 ngọn nến động. Nhấn giữ nút bằng chuột, chạm hoặc giữ Space/Enter khoảng 3,2 giây. Lửa yếu dần; thả sớm thì lửa hồi lại.
5. Nến tắt: chuyển ngay sang nền đêm, pháo hoa nhiều màu, dây đèn, đèn sân khấu và lời chúc. Có lá thư và nút đi lại hành trình.

Các cảnh là hình ảnh tượng trưng; không khẳng định sự kiện có thật trong đời người nhận. Nhân vật và tranh được vẽ bằng SVG/Canvas. Không có backend, microphone, analytics hoặc lưu dữ liệu cá nhân. Âm thanh là nhạc tự tạo bằng Web Audio, chỉ bật khi bấm nút.

## Tùy chỉnh
- script.js / chapters: các mốc năm, tên giai đoạn, lời kể.
- script.js / makeMemory: tranh cho 6 giai đoạn.
- script.js / avatarMarkup: nhân vật đại diện.
- script.js / CHAPTER_SECONDS: thời lượng một chặng.
- index.html: nội dung mở đầu, cánh cửa, sinh nhật, lá thư.
- styles.css: màu, bố cục, hiệu ứng, responsive.

Kiểu chữ dùng Google Fonts với font dự phòng nếu không có mạng. Nút Giảm chuyển động và thiết lập tương ứng của thiết bị được hỗ trợ.

## Đăng lên GitHub Pages
Bản V1 vẫn được lưu riêng ở ../hue-birthday-v1 và ../hue-birthday-v1.zip.

Để giữ V1 online đồng thời với V2: tải các file của bản này vào thư mục v2 trong repository PhanVanHai2004/happy-birthday. Cấu hình Pages giữ nguyên nhánh main, /(root). Link dự kiến sau khi deploy thành công: https://phanvanhai2004.github.io/happy-birthday/v2/

Để thay trang chủ bằng V2: tải index.html, styles.css, script.js và .nojekyll vào gốc repository, ghi đè các file cùng tên. Mã V1 cục bộ vẫn giữ nguyên.

Mã V2 đã được đưa vào thư mục v2 trong repository. GitHub Pages tự triển khai khi nhánh main thay đổi. Trạng thái triển khai cần được kiểm tra trên trang Actions hoặc bằng cách mở link V2.
