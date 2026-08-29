<p align="center">
  <img src="https://i.pinimg.com/564x/ac/f4/68/acf4682de9b6a953fc47a5dfcf8d7606.jpg" alt="RELACK Logo" width="120" style="border-radius: 12px;"/>
</p>

<h1 align="center">🎵 RELACK - Music Player Web App</h1>

<p align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-5773ff" alt="Version"/>
  <img src="https://img.shields.io/badge/license-MIT-green" alt="License"/>
  <img src="https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white" alt="HTML5"/>
  <img src="https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white" alt="CSS3"/>
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black" alt="JavaScript"/>
  <img src="https://img.shields.io/badge/YouTube_API-FF0000?logo=youtube&logoColor=white" alt="YouTube API"/>
</p>

<p align="center">
  <strong>RELACK</strong> là nền tảng nghe nhạc trực tuyến dành cho những bản nhạc ít được biết đến, 
  được xây dựng bằng HTML, CSS, JavaScript thuần và YouTube IFrame API.
</p>

---

## 📑 Mục lục

- [Giới thiệu](#-giới-thiệu)
- [Tính năng nổi bật](#-tính-năng-nổi-bật)
- [Demo](#-demo)
- [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [Cấu trúc dự án](#-cấu-trúc-dự-án)
- [Cài đặt & Chạy dự án](#-cài-đặt--chạy-dự-án)
- [Hướng dẫn sử dụng](#-hướng-dẫn-sử-dụng)
- [Danh sách bài hát](#-danh-sách-bài-hát)
- [Cấu hình YouTube API](#-cấu-hình-youtube-api)
- [Tùy chỉnh giao diện](#-tùy-chỉnh-giao-diện)
- [Đóng góp](#-đóng-góp)
- [Bản quyền](#-bản-quyền)
- [Liên hệ](#-liên-hệ)

---

## ✨ Giới thiệu

**RELACK** là nơi chúng tôi phát hành những bản nhạc chưa được nhiều người biết đến. Toàn bộ nhạc đều được xác nhận bản quyền bởi chính nghệ sĩ đã tải lên.

Ứng dụng được xây dựng hoàn toàn bằng **Vanilla JavaScript** (không dùng framework), sử dụng **YouTube IFrame API** để phát nhạc ẩn video (chỉ phát audio), và lưu trữ dữ liệu người dùng bằng **localStorage / sessionStorage**.

---

## 🚀 Tính năng nổi bật

### 🎧 Trình phát nhạc
| Tính năng | Mô tả |
|-----------|-------|
| ▶️ Play / Pause | Phát và tạm dừng bài hát |
| ⏭️ Next / Previous | Chuyển bài tiếp theo / quay lại bài trước |
| 🔀 Shuffle | Phát ngẫu nhiên (có lưu lịch sử để quay lại được) |
| 🔁 Repeat | 3 chế độ: Không lặp → Lặp 1 lần → Lặp vô hạn |
| ⏩ Thanh tiến trình | Click để tua đến vị trí bất kỳ |
| 🔊 Volume | Kéo thanh âm lượng + click icon để mute/unmute |
| ⏱️ Tốc độ phát | Điều chỉnh tốc độ (0.5x, 1x, 1.5x, 2x...) |
| ⏰ Báo thức | Đặt giờ báo thức bằng nhạc |

### 👤 Hệ thống người dùng
- ✅ Đăng nhập / Đăng ký (lưu `localStorage` + `sessionStorage`)
- ✅ Hiển thị avatar + tên người dùng
- ✅ Cài đặt tài khoản: đổi username, password, avatar, giới tính
- ✅ Đăng xuất có xác nhận

### 🔍 Tìm kiếm
- Tìm theo **tên bài hát** (chính xác)
- Tìm theo **code bài hát** (ví dụ: `00110`, `01610`...)

### 🎨 Giao diện
- 🌙 **Dark Mode / Light Mode** — chuyển đổi và lưu trạng thái
- 📱 **Responsive** — tương thích Desktop, Tablet, Mobile
- 🎭 Thể loại (Genres) & Nghệ sĩ (Artists) với nút **See all / Hide**

### 📤 Khác
- Tải lên bài hát mới (Upload Modal)
- Footer với liên kết mạng xã hội và quick links

---

## 🖼️ Demo

> 📸 *Chụp ảnh màn hình hoặc quay GIF trang chủ rồi chèn vào đây*

```
![Homepage](./screenshots/homepage.png)
![Player](./screenshots/player.png)
![Dark Mode](./screenshots/dark-mode.png)
![Light Mode](./screenshots/light-mode.png)
```

---

## 🛠️ Công nghệ sử dụng

| Công nghệ | Vai trò |
|-----------|---------|
| **HTML5** | Cấu trúc trang |
| **CSS3** | Giao diện, responsive, animation |
| **JavaScript ES6+** | Logic xử lý, DOM manipulation |
| **YouTube IFrame API** | Phát nhạc (ẩn video, chỉ lấy audio) |
| **YouTube Data API v3** | Lấy thời lượng video |
| **localStorage / sessionStorage** | Lưu trữ dữ liệu người dùng, volume, theme |
| **Boxicons** | Hệ thống icon (`bx`, `bxs`) |
| **Google Fonts** | Font `Roboto` & `Alexandria` |

---

## 📂 Cấu trúc dự án

```
RELACK/
│
├── 📄 index.html              # Trang chủ - Music Player
├── 📄 scripts.js              # Toàn bộ logic JavaScript
├── 📄 style.css               # Toàn bộ giao diện CSS
├── 📄 README.md               # File này
│
├── 📁 Log/
│   └── form.html              # Trang Đăng nhập / Đăng ký
│
├── 📁 Explore/
│   └── explore.html           # Trang Khám phá
│
├── 📁 Introduction/
│   └── intro.html             # Trang Giới thiệu
│
├── 📁 Contact/
│   └── contact.html           # Trang Liên hệ
│
├── 📁 screenshots/            # Ảnh chụp màn hình (tự tạo)
│   ├── homepage.png
│   ├── player.png
│   └── ...
│
└── 📁 assets/
    └── default-avatar.png     # Avatar mặc định
```

---

## ⚙️ Cài đặt & Chạy dự án

### Yêu cầu
- Trình duyệt web hiện đại (Chrome, Firefox, Edge, Safari...)
- Kết nối Internet (để tải YouTube API, fonts, icons)
- *(Tùy chọn)* Python hoặc Node.js để chạy local server

### Cách 1: Mở trực tiếp
```bash
# Chỉ cần mở file index.html bằng trình duyệt
# Nhấp đúp vào index.html hoặc kéo thả vào trình duyệt
```

### Cách 2: Dùng Local Server (Khuyến nghị)

**Với Python:**
```bash
cd RELACK
python -m http.server 8080
# Mở trình duyệt tại: http://localhost:8080
```

**Với Node.js (npx):**
```bash
cd RELACK
npx serve .
# Mở trình duyệt tại: http://localhost:3000
```

**Với VS Code:**
> Cài extension **Live Server** → Click chuột phải vào `index.html` → **Open with Live Server**

---

## 📖 Hướng dẫn sử dụng

### 🎵 Nghe nhạc
1. Nhấn nút **"Listen Now"** ở phần Trending để bắt đầu
2. Hoặc nhấn icon ▶️ trên từng bài hát trong danh sách
3. Sử dụng thanh điều khiển phía dưới để: Play/Pause, Next, Previous, Shuffle, Repeat

### 🔍 Tìm kiếm bài hát
- Nhập **tên bài hát** hoặc **code bài hát** vào ô tìm kiếm
- Nhấn **Enter** hoặc click icon 🔍
- Ví dụ: nhập `00110` để tìm bài "Falls In Luv"

### 👤 Đăng nhập / Đăng ký
1. Click icon **người dùng** ở góc phải trên cùng
2. Chuyển đến trang `Log/form.html`
3. Đăng nhập hoặc tạo tài khoản mới
4. Sau khi đăng nhập: hiển thị avatar, tên, nút cài đặt ⚙️

### ⚙️ Cài đặt tài khoản
1. Đăng nhập → Click icon **⚙️ (cog)**
2. Thay đổi: Username, Password, Avatar, Giới tính
3. Nhấn **"Save Changes"** để lưu

### 🌙 Chuyển đổi Dark/Light Mode
- Click icon **🌙/☀️** trên thanh công cụ
- Trạng thái theme được lưu lại cho lần mở sau

### ⏰ Đặt báo thức
1. Click icon **🔔 (alarm)**
2. Chọn **"Chọn giờ báo thức"** → Nhập thời gian (HH:MM)
3. Có thể điều chỉnh tốc độ phát qua nút **"Điều chỉnh tốc độ phát"**

### 📤 Tải lên bài hát
1. Đăng nhập (bắt buộc)
2. Click icon **📤 (upload)**
3. Điền thông tin: ID video YouTube, ảnh, tên bài, nghệ sĩ, code
4. Chọn Public/Private → Nhấn **Lưu**

---

## 🎵 Danh sách bài hát

Dự án hiện có **118+ bài hát** được chia thành 3 nhóm:

| Nhóm | Số lượng | Mô tả |
|------|----------|-------|
| `songs` | 7 bài | Hiển thị mặc định trên trang chủ |
| `hiddenSongs` | 8 bài | Hiện khi nhấn "See all" |
| `codeSongs` | 103 bài | Tìm kiếm qua code hoặc "See all" mở rộng |

### Ví dụ cấu trúc bài hát:
```javascript
{
  title: "Falls In Luv",
  artist: "Côngg",
  videoId: "GgKhuJ-Qx_I",     // YouTube Video ID
  imageUrl: "https://...",      // Ảnh thumbnail
  duration: "01:41",           // Thời lượng
  codesngs: "00110",           // Code tìm kiếm
  public: true
}
```

---

## 🔑 Cấu hình YouTube API

### ⚠️ Quan trọng
Trong file `scripts.js`, hàm `getVideoDuration()` có chứa API key:

```javascript
const apiKey = "YOUR_YOUTUBE_API_KEY_HERE";
```

### Cách lấy API Key mới:
1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo Project mới
3. Bật **YouTube Data API v3**
4. Vào **Credentials** → Tạo **API Key**
5. Thay thế key trong `scripts.js`

> ⚠️ **Lưu ý bảo mật:** Không nên hardcode API key trong mã nguồn công khai. 
> Hãy cân nhắc dùng backend proxy hoặc giới hạn key theo domain trong Google Cloud Console.

---

## 🎨 Tùy chỉnh giao diện

### Thay đổi màu chủ đề
Mở `style.css` và chỉnh sửa biến CSS tại `:root`:

```css
:root {
  --bg-color: #050505;          /* Nền tối */
  --secondary-bg: #18181d;      /* Nền phụ */
  --text-color: #fff;           /* Màu chữ */
  --accent-color: #5773ff;      /* Màu nhấn */
  --card-bg: #202026;           /* Nền card */
  --progress-bg: #32323d;       /* Nền progress bar */
}

.light-mode {
  --bg-color: #f5f5f5;
  --secondary-bg: #ffffff;
  --text-color: #1a1a1a;
  --accent-color: #2c5eff;
  --card-bg: #ffffff;
  --progress-bg: #e0e0e0;
}
```

### Thêm bài hát mới
Mở `scripts.js`, thêm object vào mảng `songs`, `hiddenSongs` hoặc `codeSongs`:

```javascript
{
  title: "Tên bài hát",
  artist: "Tên nghệ sĩ",
  videoId: "YOUTUBE_VIDEO_ID",
  imageUrl: "LINK_ANH_THUMBNAIL",
  duration: "03:30",
  codesngs: "11910",
  public: true
}
```

### Thêm thể loại / nghệ sĩ
```javascript
const genres = [
  `Electro </br> Pop`,
  `Dance </br> Beat`,
  // Thêm thể loại mới...
];

const artists = [
  "Tên nghệ sĩ mới",
  // Thêm nghệ sĩ mới...
];
```

---

## 🤝 Đóng góp

Chúng tôi hoan nghênh mọi đóng góp từ cộng đồng!

### Quy trình đóng góp:
1. **Fork** repository
2. Tạo branch mới:
   ```bash
   git checkout -b feature/ten-tinh-nang
   ```
3. Commit changes:
   ```bash
   git commit -m "✨ Thêm tính năng mới"
   ```
4. Push to branch:
   ```bash
   git push origin feature/ten-tinh-nang
   ```
5. Mở **Pull Request**

### Quy ước commit:
| Prefix | Ý nghĩa |
|--------|----------|
| `✨` | Tính năng mới |
| `🐛` | Sửa lỗi |
| `📝` | Cập nhật tài liệu |
| `🎨` | Giao diện / CSS |
| `⚡` | Tối ưu hiệu suất |
| `🔥` | Xóa code không cần |

---

## 📋 Roadmap

- [ ] Thêm trang Explore hoàn chỉnh
- [ ] Hỗ trợ tìm kiếm không dấu / fuzzy search
- [ ] Tạo playlist cá nhân
- [ ] Chế độ phát lặp playlist
- [ ] Hiển thị lời bài hát (Lyrics)
- [ ] Chia sẻ bài hát qua link
- [ ] Chế độ nghe offline (PWA)
- [ ] Tích hợp backend thật thay vì localStorage

---

## 📄 Bản quyền

Dự án được phát hành theo giấy phép **MIT License**.

> Toàn bộ nhạc trong dự án đã được **xác nhận bản quyền** bởi nghệ sĩ tải lên. 
> RELACK chỉ phát hành nhạc chưa được phổ biến rộng rãi.

---

## 👥 Tác giả

| Vai trò | Tên | Liên hệ |
|---------|-----|---------|
| Developer | *Tên của bạn* | [GitHub](https://github.com/username) |
| Music Curator | *Tên* | [Email](mailto:email@example.com) |

---

## 📞 Liên hệ

- 🌐 Website: [RELACK](#)
- 📧 Email: `contact@relack.com`
- 💬 Discord: [Tham gia server](#)
- 🐙 GitHub: [github.com/relack](#)

---

## 🙏 Lời cảm ơn

- Cảm ơn tất cả nghệ sĩ đã tin tưởng và chia sẻ nhạc trên RELACK
- [Boxicons](https://boxicons.com/) cho hệ thống icon tuyệt đẹp
- [Google Fonts](https://fonts.google.com/) cho font Roboto & Alexandria
- YouTube IFrame API cho khả năng phát nhạc mạnh mẽ

---

<p align="center">
  <sub>© 2025 RELACK. All rights reserved. Made with ❤️ for music lovers.</sub>
</p>
