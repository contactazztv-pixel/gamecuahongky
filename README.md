# TIỆM NHỎ TRƯỚC CỔNG TRƯỜNG (School Gate Cozy Bistro)

> **Web Game 2D Indie Mô Phỏng Kinh Doanh Ẩm Thực Học Đường Việt Nam**  
> Xây dựng với **React 19 + TypeScript + Vite + Tailwind CSS + Zustand + Dexie IndexedDB + Web Audio API**.

---

## 🌟 1. Giới Thiệu Dự Án

**Tiệm Nhỏ Trước Cổng Trường** là một tựa game web 2D phong cách hoạt hình nhẹ nhàng, tái hiện lại những ký ức tuổi học trò thân thương trước cổng trường học Việt Nam: hàng phượng vĩ, xe đạp, bác bảo vệ tận tụy, nhóm bạn thân áo dài trắng, tiếng trống trường giòn giã và những món quà vặt quen thuộc thơm lừng (trà sữa trân châu, bánh tráng trộn, cá viên chiên sốt cay, bánh mì pate giòn rụm, xôi mặn lạp xưởng...).

Game chạy 100% Client-side (Offline-first), không cần cài backend, không tài khoản đăng nhập, bảo vệ tuyệt đối dữ liệu người chơi trên thiết bị cá nhân.

---

## 🎮 2. Các Tính Năng Cốt Lõi Đã Hoàn Thiện

1. **Hệ Thống Thời Gian Học Đường (Game Clock):**
   - Vòng lặp nhịp sống theo các khung giờ thực tế: *Sáng sớm (06:00)*, *Vào học (07:15)*, *Giờ ra chơi (09:15)*, *Nghỉ trưa (11:30)*, *Tan trường (16:30)*, *Xế chiều (17:45)*, *Kết thúc ngày (18:45)*.
   - Hỗ trợ Tạm dừng (`Space`), Tăng tốc thời gian (1x, 2x, 4x), Tua nhanh sang khung giờ tiếp theo.
2. **Kinh Tế & Quản Lý Cửa Hàng Chân Thực:**
   - **3 Mô Hình Kinh Doanh:** Xe Đẩy Trà Sữa (vốn 2.000.000đ), Gánh Hàng Ăn Vặt (vốn 1.200.000đ), Quầy Ăn Sáng Bánh Mì (vốn 1.500.000đ).
   - **Quản lý Thực đơn & Giá bán:** 24 món ăn độc đáo, cho phép bật/tắt món và điều chỉnh giá bán linh hoạt (+/- 1.000đ) để đón bắt phản ứng tâm lý học sinh.
   - **Kho Hàng & Chợ Đầu Mối:** Giới hạn sức chứa kho, mua sỉ theo gói, cảnh báo sắp hết nguyên liệu, ghi nhật ký nhập và tiêu thụ chi tiết.
   - **Trang Thiết Bị & Nâng Cấp Quầy:** Mở thêm trạm bếp (chế biến đồng thời nhiều món), thùng bảo ôn mở rộng kho hàng, biển hiệu neon thu hút khách, máy dập nắp siêu tốc.
   - **Sổ Thu Chi & Tài Chính (Financial Ledger):** Báo cáo chi tiết Doanh thu bán hàng, Tiền tip, Giá vốn (COGS), Chi phí nhập kho, Chi phí nâng cấp, Chi phí vận hành ngày và Lợi nhuận ròng.
3. **Thế Giới Học Đường & Nhân Vật Sống Động:**
   - **12 Nhân Vật Khách Quen:** Bé An khăn quàng đỏ, Hoàng Nam, Mai & Linh bạn thân, Thầy Nghĩa dạy Lý, Bác Tư bảo vệ, Vy họa sĩ, Minh bóng rổ...
   - **Mức Thân Thiết (Friendship 5 Cấp):** Phục vụ món khoái khẩu giúp tăng tim, mở khóa câu chuyện riêng và nhận tiền tip hào phóng.
   - **Nhiệm Vụ & Thành Tựu:** Hướng dẫn tân thủ, nhiệm vụ theo ngày, nhiệm vụ tuần học, sự kiện mùa vụ và thành tựu kinh doanh dài hạn.
   - **Lịch Học Kỳ & Sự Kiện Theo Mùa:** Mùa tựu trường, Mùa thi học kỳ, Hội trại 26/3, Ngày Nhà giáo 20/11, Lễ tổng kết năm học.
4. **Đồ Họa 2D Vector & Âm Thanh Web Audio Synthesizer:**
   - Vector SVG độc quyền vẽ tay cho toàn bộ 24 món ăn, 12 chân dung khách hàng và các nguyên liệu.
   - **Nhạc nền Lo-fi BGM:** Synthesizer giai điệu ngũ cung (Pentatonic) ấm áp, thư thái, không phụ thuộc file mp3 ngoài.
   - **Hiệu ứng âm thanh SFX:** Tiếng xèo xèo rán chảo dầu, tiếng xu leng keng, chuông đón khách, kèn chiến thắng.
   - **Visual Feedback:** Tiền vàng bay lên (`+35.000đ`), tim thân thiết bay lên, khói bốc nghi ngút từ bếp.

---

## 💻 3. Hướng Dẫn Cài Đặt & Chạy Trong VS Code

### Yêu Cầu Môi Trường
* **Node.js:** Phiên bản LTS 18.x hoặc 20.x trở lên ([Tải tại nodejs.org](https://nodejs.org/)).
* **Trình quản lý gói:** npm (đi kèm Node.js).
* **VS Code:** Khuyên dùng kèm extension *Tailwind CSS IntelliSense* và *ESLint*.

### Các Bước Thực Hiện
1. Mở thư mục dự án trong **VS Code**.
2. Mở Terminal tích hợp (`Ctrl + ~` hoặc `Terminal > New Terminal`).
3. Cài đặt các thư viện phụ thuộc:
   ```bash
   npm install
   ```
4. Khởi chạy máy chủ phát triển (Development Server):
   ```bash
   npm run dev
   ```
5. Mở trình duyệt và truy cập: **`http://localhost:5173/`**.

---

## 🧪 4. Kiểm Thử Hệ Thống (Testing)

Dự án được bảo vệ bởi bộ test tự động toàn diện bằng **Vitest** và **React Testing Library**:

* Chạy toàn bộ test suites:
  ```bash
  npm test
  ```
* Chạy test ở chế độ theo dõi thay đổi (Watch Mode):
  ```bash
  npm run test:watch
  ```

### Các nhóm bài kiểm tra chính (15 suites, 59 tests):
- `e2eGameFlow.test.ts`: Kiểm thử tuần tự trọn vẹn 18 bước luồng chơi thực tế từ lúc mở game đến khi tải lại.
- `economySimulation.test.ts`: Mô phỏng chuỗi 14 ngày kinh doanh liên tiếp, kiểm tra lạm phát, bế tắc tài chính và tính nhất quán sổ thu chi.
- `cookingSystem.test.ts`: Kiểm tra trừ nguyên liệu, slot bếp, tính toán thời gian nấu và trả món.
- `inventorySystem.test.ts`: Kiểm tra sức chứa kho, chi phí mua hàng và định giá tồn kho.
- `orderGenerator.test.ts`: Kiểm tra thuật toán sinh khách và điều kiện lọc thực đơn.
- `saveService.test.ts`: Kiểm tra lưu trữ IndexedDB, LocalStorage fallback, xác thực Schema JSON và migration.
- `questSystem.test.ts`: Kiểm tra tiến độ nhiệm vụ và chống nhận thưởng lặp.
- `customerRelationship.test.ts`: Kiểm tra điểm thân thiết và tiền tip khách quen.

---

## 📦 5. Đóng Gói & Triển Khai Production (Deployment)

### 5.1. Đóng gói mã nguồn
Chạy lệnh biên dịch và kiểm tra kiểu TypeScript:
```bash
npm run build
```
Thư mục xuất xưởng **`dist/`** sẽ được tạo ra với các asset đã được nén tối ưu (minify, gzip) và đường dẫn tương đối (`base: './'`).

Bạn có thể chạy thử nghiệm bản build production trên máy cục bộ bằng lệnh:
```bash
npm run preview
```

### 5.2. Triển khai lên các nền tảng Hosting tĩnh (Static Hosting)

#### A. Triển khai lên Vercel
1. Đẩy mã nguồn lên kho lưu trữ GitHub/GitLab.
2. Truy cập [vercel.com](https://vercel.com/) và import project.
3. Thiết lập Framework Preset: **Vite**.
4. Build Command: `npm run build`, Output Directory: `dist`.
5. Tạo file `vercel.json` ở thư mục gốc để cấu hình SPA Fallback (nếu cần):
   ```json
   {
     "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
   }
   ```

#### B. Triển khai lên Netlify
1. Tạo file `public/_redirects` với nội dung:
   ```text
   /*    /index.html   200
   ```
2. Đẩy dự án lên Netlify, chọn thư mục xuất bản là `dist`.

#### C. Triển khai lên GitHub Pages
Dự án đã được cấu hình `base: './'` trong `vite.config.ts`, do đó bạn có thể triển khai lên bất kỳ đường dẫn con nào (ví dụ: `https://username.github.io/tiem-nho/`) mà không bị lỗi 404 tài nguyên CSS/JS.
1. Build dự án: `npm run build`.
2. Đẩy thư mục `dist` lên nhánh `gh-pages` hoặc dùng action `JamesIves/github-pages-deploy-action`.

#### D. Triển khai lên Cloudflare Pages
1. Kết nối với Git repository.
2. Chọn Framework preset: **Vite**.
3. Build command: `npm run build`, Output directory: `dist`.

---

## 💾 6. Hệ Thống Lưu Trữ Dữ Liệu (Save & Backup)

* **Cơ chế lưu trữ chính:** Sử dụng **IndexedDB** (thông qua Dexie.js), hỗ trợ tự động lưu sau mỗi hành động quan trọng (mua hàng, giao đơn, nâng cấp, kết thúc ngày).
* **Cơ chế dự phòng:** Tự động fallback sang **LocalStorage** nếu trình duyệt ở chế độ ẩn danh (Private Browsing) hoặc chặn IndexedDB.
* **Xuất/Nhập file Save JSON:**
  - Nhấn icon **Bánh răng Cài đặt** ở góc trên màn hình.
  - Chọn **Xuất File JSON** để tải file tiến trình về máy tính.
  - Chọn **Nhập File JSON** để khôi phục tiến trình từ thiết bị khác.
* **Xác thực dữ liệu chặt chẽ:** Kiểm tra cấu trúc bản lưu (Schema Version 3), tự động nâng cấp dữ liệu bản lưu cũ (migration), chặn đứng file JSON sai cú pháp hoặc chứa mã độc.
* **Lưu ý theo từng thiết bị:** Dữ liệu game được lưu theo từng trình duyệt/thiết bị cục bộ. Khi xóa lịch sử duyệt web hoặc đổi thiết bị, hãy sử dụng tính năng **Xuất File JSON** để bảo toàn quán của bạn!

---

## ⌨️ 7. Danh Sách Phím Tắt Bàn Phím (Desktop Shortcuts)

* **`Space`:** Tạm dừng hoặc tiếp tục nhịp thời gian game.
* **`Escape`:** Đóng nhanh các cửa sổ Modal (Cài đặt, Sổ tay, Báo cáo ngày).
* **`1` -> `8`:** Chuyển đổi trực tiếp giữa 8 tab quản lý:
  - `1`: Quầy Phục Vụ (Hàng chờ khách & Bếp)
  - `2`: Quản Lý Thực Đơn & Giá Bán
  - `3`: Kho Hàng & Chợ Đầu Mối
  - `4`: Nâng Cấp Trang Thiết Bị
  - `5`: Sổ Nhiệm Vụ & Thành Tựu
  - `6`: Sổ Thu Chi & Tài Chính
  - `7`: Sổ Tay Khách Quen Học Đường
  - `8`: Thời Khóa Biểu & Sự Kiện Theo Mùa

---

## 📝 8. Cấu Trúc Mã Nguồn

```text
src/
├── app/                  # Luồng ứng dụng chính & điều phối màn hình
├── components/
│   ├── common/           # Modal, Toast, FloatingFeedback, DishIllustration, CharacterAvatar, IngredientIcon
│   ├── game/             # SchoolGateScene, CustomerQueue, OrderCard, DayReportModal
│   ├── layout/           # TopStatusBar, BottomDock
│   └── ui/               # GameButton, Card, Badge
├── features/
│   ├── business-selection/ # Màn hình chọn mô hình
│   ├── confirmation/     # Màn hình xác nhận khai trương
│   ├── game/             # MainGameScreen, MenuPanel, InventoryPanel, UpgradePanel, QuestPanel, LedgerPanel, RegularsPanel, CalendarPanel
│   ├── home/             # MainMenuScreen
│   ├── intro/            # IntroStoryScreen
│   ├── settings/         # SettingsModal
│   ├── shop-naming/      # ShopNamingScreen
│   └── splash/           # SplashScreen
├── game/
│   ├── config/           # gameMeta.ts (Tên game, phiên bản, đơn vị tiền)
│   ├── data/             # businessModels, menuItems, ingredients, characters, upgrades, quests
│   ├── engine/           # orderGenerator, cookingSystem, inventorySystem, economy, gameClock, questSystem, customerRelationship, schoolCalendar
│   └── types/            # TypeScript interfaces
├── services/
│   ├── audio/            # soundEffects.ts (Web Audio API Synthesizer & Lo-fi BGM)
│   └── persistence/      # db.ts (Dexie), saveService.ts (IndexedDB + JSON export/import)
├── stores/               # gameStore.ts, settingsStore.ts (Zustand)
└── test/                 # 15 test suites kiểm thử tự động toàn diện
```

---

## 📌 9. Hạn Chế Hiện Tại & Kế Hoạch Phiên Bản Tiếp Theo

### Hạn chế phiên bản 1.0.0:
- Chưa có tính năng đồng bộ hóa đám mây (Cloud Sync) tự động giữa nhiều thiết bị (hiện dựa trên xuất/nhập file JSON).
- Chưa có minigame tương tác tay khi chế biến (như kéo thả topping hay lật bánh tráng).

### Đề xuất phát triển phiên bản 2.0.0:
1. Thêm minigame tương tác nấu nướng bằng tay (lắc bánh tráng, dập nắp trà sữa, quét pate bánh mì).
2. Tùy biến trang trí ngoại cảnh (đèn lồng, bàn ghế nhựa, chậu hoa, loa phát thanh học đường).
3. Hệ thống tuyển dụng nhân viên phụ quán (bạn học làm thêm, shipper giao hàng tận lớp).
4. Thêm chế độ Sandbox (tự do kinh doanh vô hạn tiền) và Thử thách thời gian (Time Attack).

---

© 2026 **Tiệm Nhỏ Trước Cổng Trường**. Được phát triển với tình yêu dành cho tuổi học trò Việt Nam.
"# gamecuahongky" 
