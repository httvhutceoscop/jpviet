# JPVIET — Demo Level 2 (GitHub Pages)

Dự án web tĩnh học tiếng Nhật: từ vựng, ngữ pháp, flashcard, quiz. Chạy **100% trên GitHub Pages** (không cần backend).

## Cấu trúc
- `index.html`, `vocab.html`, `grammar.html`, `flashcard.html`, `quiz.html`
- `style.css`, `app.js`, `flashcard.js`, `quiz.js`
- `data/vocab.json`, `data/grammar.json`
- `audio/` chứa file mp3 (hiện chỉ là placeholder, bạn thay bằng file thật)

## Deploy nhanh lên GitHub Pages
1. Tạo repo (vd: `jpviet`), upload toàn bộ mã nguồn.
2. Vào **Settings → Pages → Source** chọn `main` branch, folder `/root`.
3. Lưu, đợi 1–2 phút. Site sẽ ở `https://<username>.github.io/jpviet/`.
4. Trỏ domain `jpviet.com`:
   - Trong repo `Settings → Pages → Custom domain`: nhập `jpviet.com`.
   - DNS: tạo bản ghi `CNAME` trỏ `jpviet.com` → `<username>.github.io` (và `www` nếu cần).
   - (Tuỳ chọn) Bổ sung A record IP GitHub Pages nếu nhà cung cấp yêu cầu.

## Tuỳ biến
- Thêm từ vựng: sửa `data/vocab.json`. Trường: `kanji`, `kana`, `romaji`, `meaning`, `audio`.
- Thêm ngữ pháp: sửa `data/grammar.json`.
- Thay file audio: đặt mp3 vào thư mục `audio/` và điền tên file vào trường `audio` của từ tương ứng.
- Reset tiến độ flashcard: xoá key `jpviet_flashcard_known` trong LocalStorage hoặc dùng DevTools → Application → Local Storage.

## Gợi ý mở rộng
- Chia theo cấp JLPT (N5→N1) bằng trường `level` trong `vocab.json`.
- Thêm chế độ Quiz ngữ pháp.
- PWA để dùng offline hoàn toàn.
