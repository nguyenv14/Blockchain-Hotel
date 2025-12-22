# Hướng dẫn Deploy Smart Contracts

## Yêu cầu

- Node.js đã được cài đặt
- Hardhat đã được cài đặt (`npm install`)
- OpenZeppelin contracts đã được cài đặt (`npm install @openzeppelin/contracts`)

## Các Contract

1. **HotelToken.sol** - ERC20 Token (HotelCoin - HTC)
2. **HotelBooking.sol** - Contract xử lý đặt phòng

## Cách Deploy

### Bước 1: Khởi động Local Blockchain

```bash
npx hardhat node
```

Lệnh này sẽ:
- Tạo 20 test accounts với private keys
- Account đầu tiên (#0) là Admin
- Chain ID: 31337
- RPC URL: http://127.0.0.1:8545

### Bước 2: Deploy Contracts

Có 2 cách deploy:

#### Cách 1: Deploy cả 2 contract cùng lúc (Khuyên dùng)

```bash
npx hardhat ignition deploy ignition/modules/HotelBookingWithToken.ts --network localhost
```

Sau khi deploy, lưu lại 2 địa chỉ contract:
- `hotelToken`: Địa chỉ HotelToken contract
- `hotelBooking`: Địa chỉ HotelBooking contract

#### Cách 2: Deploy từng contract riêng

**Deploy HotelToken trước:**
```bash
npx hardhat ignition deploy ignition/modules/HotelToken.ts --network localhost
```

Lưu lại địa chỉ `hotelToken`, ví dụ: `0x5FbDB2315678afecb367f032d93F642f64180aa3`

**Deploy HotelBooking sau:**
```bash
npx hardhat ignition deploy ignition/modules/HotelBooking.ts --network localhost --parameters '{"HotelBookingModule":{"tokenAddress":"0x5FbDB2315678afecb367f032d93F642f64180aa3"}}'
```

Thay `0x5FbDB2315678afecb367f032d93F642f64180aa3` bằng địa chỉ HotelToken thực tế.

### Bước 3: Setup Hotel (Tùy chọn)

Sau khi deploy, chạy script setup để:
- Transfer token cho user test
- Set giá phòng

```bash
# Set biến môi trường
export HOTEL_TOKEN_ADDRESS=0x...
export HOTEL_BOOKING_ADDRESS=0x...

# Chạy script
npx hardhat run scripts/setup-hotel.ts --network localhost
```

Hoặc tạo file `.env`:
```
HOTEL_TOKEN_ADDRESS=0x...
HOTEL_BOOKING_ADDRESS=0x...
```

## Cấu hình Frontend

Sau khi deploy, cập nhật file `.env` trong dự án frontend:

```env
NUXT_PUBLIC_HOTEL_TOKEN_ADDRESS=0x...
NUXT_PUBLIC_HOTEL_BOOKING_ADDRESS=0x...
```

## Test Flow

1. **Nạp tiền (Backend):**
   - User chuyển khoản VND
   - Backend gọi `hotelToken.transfer(userAddress, amount)`

2. **Đặt phòng (Frontend):**
   - User approve token: `hotelToken.approve(bookingAddress, amount)`
   - User đặt phòng: `hotelBooking.bookRoom(roomId)`

## Lưu ý

- Địa chỉ contract sẽ khác nhau mỗi lần deploy
- Lưu lại địa chỉ contract để cấu hình frontend
- Test accounts từ `npx hardhat node` có sẵn 10,000 ETH để trả gas fee

