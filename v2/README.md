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

## Cập nhật V2.1 — đường hầm tròn
Hầm được dựng bằng phối cảnh 3D dạng ống tròn hữu hạn, có lối đi giữa hầm và cửa cuối hầm. Nhân vật nhìn từ phía sau, tiến dọc hầm. Sáu cảnh được gắn cố định lên hai thành hầm theo thứ tự năm, có phối cảnh và lần lượt đi qua khi camera theo nhân vật. Thanh hành trình hiện tiến độ từ lối vào đến cuối hầm.

## Cập nhật V2.2 — cảm xúc và lễ hội
- Nhân vật quay đầu trái/phải và ngẩng lên theo vị trí ký ức, có 6 biểu cảm và lời nghĩ tương ứng; mắt, miệng, lông mày thay đổi theo chặng.
- Cánh cửa chỉ là điểm sáng nhỏ ở xa; hiện hình và lớn dần khi gần cuối hầm.
- Pháo hoa nhiều tầng với các kiểu vòng tròn, chùm nở, tim và chùm vàng rủ; nhiều màu, vệt sáng, phạm vi rộng.
- Pháo giấy bắn từ hai bên và tiếp tục rơi; hỗ trợ chế độ giảm chuyển động.

## Cập nhật V2.3 — vũ trụ và lời ước
- Ảnh nền tinh vân tạo mới bằng ImageGen, phối hợp đường hầm kính trong suốt. Xem assets/README.md để biết prompt và nguồn ảnh.
- Các hành tinh có bề mặt, vùng ngày/đêm, khí quyển và vành đai; sao nhiều lớp, mặt trăng, thiên thạch và sao băng chuyển động theo chiều sâu. Đây là khung cảnh điện ảnh minh họa, không phải bản đồ thiên văn.
- Nút Viết điều ước trước khi thổi nến, có gợi ý và nội dung tùy nhập (tối đa 180 ký tự). Điều ước hiện lại ở màn pháo hoa.
- Điều ước chỉ nằm trong bộ nhớ phiên xem; không dùng localStorage, không gửi API hay lưu lên máy chủ. Tải lại trang sẽ xóa điều ước.
- Khi deploy, cần tải cả thư mục assets cùng mã nguồn. File HTML gộp hue-birthday-v2-preview.html đã nhúng ảnh nền để mở riêng được.
