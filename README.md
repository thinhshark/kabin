# Kabin

Frontend đặt phòng theo giờ, tự nhận phòng bằng mã cửa. Một bộ giao diện: layout máy tính, màn hẹp tự xếp lại thành điện thoại.

## Chạy

```bash
npm install
npm run dev
```

Mở http://127.0.0.1:5173/

## Tài khoản minh họa

Đăng nhập bằng số `0912345678`. Mã OTP là bất kỳ 6 số; `000000` là mã sai. Vé mẫu của Nguyễn Minh Anh nằm trong tài khoản này.

Mã ưu đãi: `KABIN10`, `NGHITHU`. Thông tin ngân hàng và mã QR là dữ liệu minh họa.

## Luồng

Trang chủ → cơ sở → chọn phòng → kiểm tra thông tin → thanh toán (giữ phòng 5 phút) → vé → hướng dẫn nhận phòng.

Hết giờ giữ phòng, hoặc chọn “Tôi đã chuyển khoản”, vào hai trạng thái xử lý riêng. Khách không có tài khoản tra cứu vé bằng số điện thoại.
