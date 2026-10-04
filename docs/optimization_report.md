# BÁO CÁO TỐI ƯU HIỆU NĂNG ỨNG DỤNG REACT

## 1. Mục tiêu và Công cụ đo lường
- **Mục tiêu:** Tối ưu hóa hiệu năng render và xử lý dữ liệu cho danh sách 5.000 người dùng.
- **Công cụ đo lường:** Lighthouse (Chrome DevTools) / Web Vitals.
- **Các chỉ số chính cần theo dõi (Core Web Vitals):**
  1. **FCP (First Contentful Paint):** Thời gian hiển thị nội dung đầu tiên.
  2. **LCP (Largest Contentful Paint):** Thời gian hiển thị phần tử lớn nhất trên màn hình (thường là bảng dữ liệu hoặc ảnh).
  3. **TBT (Total Blocking Time):** Tổng thời gian main thread bị block không phản hồi người dùng.
  4. **CLS (Cumulative Layout Shift):** Độ giật lag, xê dịch bố cục trong quá trình load.

---

## 2. Kết quả đo lường TRƯỚC khi tối ưu (Baseline)

Dựa trên kết quả chạy Lighthouse ban đầu:

| Chỉ số | Giá trị đo được | Đánh giá | Nguyên nhân chính (Phỏng đoán) |
|---|---|---|---|
| **FCP** | 2.0 s | 🔴 Kém | Chờ gọi API lấy 5000 records đồng thời (payload quá lớn) khiến JS bundle phải parse khối lượng data khổng lồ trước khi render. |
| **LCP** | 3.5 s | 🔴 Kém | Gắn liền với thời gian render xong cái Table 5000 user và load hàng loạt thumbnail ảnh không có lazy load. |
| **TBT** | 30 ms | 🟢 Tốt | JS chưa bị block lúc load ban đầu, nhưng sẽ tăng vọt lên hàng trăm ms nếu user gõ search. |
| **CLS** | 0.002 | 🟢 Tốt | Bố cục khá ổn định, không bị nhảy layout. |
| **Speed Index**| 5.8 s | 🔴 Kém | Toàn bộ trang mất quá lâu để render hoàn thiện. |

*Nhận xét:* Ứng dụng đang gặp vấn đề nặng về LCP và Speed Index do phải tải và render lượng data và hình ảnh khổng lồ ngay từ lần load đầu tiên.

---

## 3. Các giải pháp tối ưu đã áp dụng (Dự kiến)

### Giải pháp 1: Tối ưu hoá State và Re-render (React.memo, useMemo, useCallback)
- **Vấn đề:** Mọi tác vụ (mở modal, chọn checkbox) đều khiến App.tsx re-render, kéo theo filter 5000 item chạy lại.
- **Cách giải quyết:** Bọc hàm filter/sort bằng `useMemo`. Bọc các hàm handler (`onSelectUser`, `onSortChange`) bằng `useCallback`. Bọc `UserTable`, `UserStats` bằng `React.memo` để tránh render mồi.

### Giải pháp 2: Áp dụng Debounce cho ô tìm kiếm
- **Vấn đề:** Gõ 1 chữ vào ô search → state đổi → filter 5000 item chạy ngay lập tức gây đơ UI.
- **Cách giải quyết:** Sử dụng custom hook `useDebounce` (hoặc lodash), delay quá trình cập nhật chuỗi filter khoảng 300-500ms sau khi người dùng dừng gõ.

### Giải pháp 3: Virtualization (Render cửa sổ DOM)
- **Vấn đề:** Component đang nhét toàn bộ thẻ `<tr>` của 1 trang (có thể lên tới hàng trăm) vào DOM cùng lúc.
- **Cách giải quyết:** Sử dụng `tanstack/react-virtual` để chỉ render những row đang nằm lọt trong viewport của màn hình. Giảm LCP và cải thiện mạnh TBT khi đổi trang.

### Giải pháp 4: Lazy Load hình ảnh
- **Vấn đề:** Trình duyệt cố gắng tải toàn bộ ảnh thumbnail của User cùng lúc.
- **Cách giải quyết:** Thêm thuộc tính `loading="lazy"` vào thẻ `<img>` trong Table. Giúp giảm tải network và cải thiện Speed Index.

---

## 4. Kết quả đo lường SAU khi tối ưu

| Chỉ số | Giá trị đo được | Cải thiện so với cũ |
|---|---|---|
| **FCP** | (Chờ đo lại) | ... |
| **LCP** | (Chờ đo lại) | ... |
| **TBT** | (Chờ đo lại) | ... |
| **CLS** | (Chờ đo lại) | ... |
| **Speed Index**| (Chờ đo lại) | ... |

**Kết luận:** (Sẽ điền sau khi hoàn tất tối ưu)
