# JPVIET - Ứng dụng học tiếng Nhật

Ứng dụng web học tiếng Nhật với giao diện tiếng Việt, hỗ trợ PWA và cấu trúc JLPT N5→N1.

## 🌟 Tính năng chính

### 📚 Học từ vựng theo JLPT
- **N5 (Sơ cấp)**: 80-100 Kanji, 800 từ vựng cơ bản
- **N4 (Sơ trung cấp)**: 300 Kanji, 1,500 từ vựng
- **N3 (Trung cấp)**: 650 Kanji, 3,000 từ vựng
- **N2 (Trung cao cấp)**: 1,000 Kanji, 6,000 từ vựng
- **N1 (Cao cấp)**: 2,000 Kanji, 10,000 từ vựng

### 📖 Ngữ pháp từ cơ bản đến nâng cao
- Ngữ pháp cơ bản (N5): です, は, が
- Ngữ pháp trung cấp (N4): て形, 可能形
- Ngữ pháp nâng cao (N3): 受身形, 使役形
- Ngữ pháp chuyên môn (N2-N1): 敬語, 文語

### 🃏 Flashcard tương tác
- Học từ vựng và ngữ pháp qua flashcard
- Lưu tiến độ học tập
- Hỗ trợ offline

### 📝 Quiz luyện tập
- Kiểm tra kiến thức theo cấp độ
- Đa dạng loại câu hỏi
- Xem điểm số tức thì

### 📱 Sidebar Menu
- Menu điều hướng thông minh
- Responsive design cho mobile/desktop
- Animation mượt mà với cubic-bezier
- Theo dõi tiến độ học tập
- Tích hợp PWA install
- Hỗ trợ keyboard navigation

### 🎨 Modern Effects & Animations
- **Button Effects**: Hover lift, ripple effect, focus glow
- **Input Effects**: Gradient borders, hover transforms, focus states
- **Card Effects**: Shine animation, scale transforms, shadow depth
- **Table Effects**: Row hover, scale effects, gradient backgrounds
- **Link Effects**: Underline animation, color transitions
- **Scroll Effects**: Custom scrollbar, smooth animations
- **Form Elements**: Custom checkboxes, enhanced selects
- **Loading States**: Shimmer effects, progress animations

## 🚀 Tính năng PWA

- **Cài đặt như ứng dụng**: Thêm vào màn hình chính
- **Hoạt động offline**: Cache dữ liệu để học không cần internet
- **Responsive design**: Tối ưu cho mọi thiết bị
- **Push notifications**: Thông báo cập nhật và nhắc nhở học tập

## 🎯 Cấu trúc JLPT

### N5 - Sơ cấp
- Hiragana và Katakana
- Kanji cơ bản
- Giao tiếp hàng ngày

### N4 - Sơ trung cấp
- Mở rộng từ vựng
- Ngữ pháp trung cấp
- Đọc hiểu cơ bản

### N3 - Trung cấp
- Kanji trung cấp
- Ngữ pháp nâng cao
- Giao tiếp tự tin

### N2 - Trung cao cấp
- Kanji cao cấp
- Ngữ pháp phức tạp
- Làm việc tại Nhật

### N1 - Cao cấp
- Kanji chuyên sâu
- Ngữ pháp chuyên môn
- Thành thạo như người bản xứ

## 🛠️ Cài đặt và sử dụng

### Cài đặt PWA
1. Mở trang web trên trình duyệt hỗ trợ PWA
2. Click nút "📱 Cài đặt App" ở góc phải header
3. Chọn "Cài đặt" trong hộp thoại
4. Ứng dụng sẽ xuất hiện trên màn hình chính

### Sử dụng offline
- Dữ liệu được cache tự động
- Học từ vựng và ngữ pháp không cần internet
- Audio files cần kết nối để phát

## 📱 Hỗ trợ trình duyệt

- Chrome/Edge (khuyến nghị)
- Firefox
- Safari (iOS)
- Samsung Internet

## 🔧 Phát triển

### Cấu trúc thư mục
```
jpviet/
├── index.html          # Trang chủ
├── jlpt.html          # JLPT Overview
├── vocab.html         # Từ vựng
├── grammar.html       # Ngữ pháp
├── flashcard.html     # Flashcard
├── quiz.html          # Quiz
├── offline.html       # Trang offline
├── demo-sidebar.html  # Demo sidebar menu
├── demo-effects.html  # Demo modern effects
├── manifest.json      # PWA manifest
├── sw.js             # Service Worker
├── pwa.js            # PWA management
├── sidebar.js        # Sidebar menu component
├── app.js            # Logic chính
├── style.css         # Styles
├── data/
│   ├── vocab.json    # Dữ liệu từ vựng
│   └── grammar.json  # Dữ liệu ngữ pháp
└── audio/            # File âm thanh
```

### Thêm dữ liệu mới
1. Cập nhật `data/vocab.json` với trường `jlpt_level`
2. Cập nhật `data/grammar.json` với trường `jlpt_level`
3. Thêm audio files vào thư mục `audio/`

## 📄 License

MIT License - Xem file [LICENSE](LICENSE) để biết thêm chi tiết.

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Hãy tạo issue hoặc pull request để cải thiện ứng dụng.

---

**JPVIET** - Học tiếng Nhật dễ dàng với người Việt! 🇯🇵🇻🇳
