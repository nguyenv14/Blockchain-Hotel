/**
 * Script để setup hotel sau khi deploy contracts
 * - Set giá phòng
 * - Transfer token cho user test
 * 
 * Usage:
 * npx hardhat run scripts/setup-hotel.ts --network localhost
 */

import { ethers } from "hardhat";

async function main() {
  // Lấy signers (accounts)
  const [admin, user1] = await ethers.getSigners();

  console.log("Admin address:", admin.address);
  console.log("User1 address:", user1.address);

  // TODO: Cập nhật địa chỉ contract sau khi deploy
  const HOTEL_TOKEN_ADDRESS = process.env.HOTEL_TOKEN_ADDRESS || "";
  const HOTEL_BOOKING_ADDRESS = process.env.HOTEL_BOOKING_ADDRESS || "";

  if (!HOTEL_TOKEN_ADDRESS || !HOTEL_BOOKING_ADDRESS) {
    console.error("Vui lòng set HOTEL_TOKEN_ADDRESS và HOTEL_BOOKING_ADDRESS trong .env");
    process.exit(1);
  }

  // Kết nối với contracts
  const HotelToken = await ethers.getContractFactory("HotelToken");
  const HotelBooking = await ethers.getContractFactory("HotelBooking");

  const hotelToken = HotelToken.attach(HOTEL_TOKEN_ADDRESS);
  const hotelBooking = HotelBooking.attach(HOTEL_BOOKING_ADDRESS);

  console.log("\n=== Setup Hotel ===");

  // 1. Transfer 50 HTC cho user1 để test
  console.log("\n1. Transfer 50 HTC cho user1...");
  const transferAmount = ethers.parseUnits("50", 18); // 50 HTC
  const transferTx = await hotelToken.transfer(user1.address, transferAmount);
  await transferTx.wait();
  console.log("✓ Đã transfer 50 HTC cho user1");

  // 2. Set giá phòng
  console.log("\n2. Set giá phòng...");
  
  // Phòng 101: 10 HTC
  const setRoom101 = await hotelBooking.setRoom(101, 10);
  await setRoom101.wait();
  console.log("✓ Phòng 101: 10 HTC");

  // Phòng 102: 15 HTC
  const setRoom102 = await hotelBooking.setRoom(102, 15);
  await setRoom102.wait();
  console.log("✓ Phòng 102: 15 HTC");

  // Phòng 103: 20 HTC
  const setRoom103 = await hotelBooking.setRoom(103, 20);
  await setRoom103.wait();
  console.log("✓ Phòng 103: 20 HTC");

  // 3. Kiểm tra số dư
  console.log("\n3. Kiểm tra số dư:");
  const adminBalance = await hotelToken.balanceOf(admin.address);
  const user1Balance = await hotelToken.balanceOf(user1.address);
  
  console.log(`Admin balance: ${ethers.formatUnits(adminBalance, 18)} HTC`);
  console.log(`User1 balance: ${ethers.formatUnits(user1Balance, 18)} HTC`);

  // 4. Kiểm tra thông tin phòng
  console.log("\n4. Thông tin phòng:");
  const room101 = await hotelBooking.rooms(101);
  console.log(`Phòng 101: ${ethers.formatUnits(room101.price, 18)} HTC, Booked: ${room101.isBooked}`);

  console.log("\n=== Setup hoàn tất! ===");
  console.log("\nContract addresses:");
  console.log(`HotelToken: ${HOTEL_TOKEN_ADDRESS}`);
  console.log(`HotelBooking: ${HOTEL_BOOKING_ADDRESS}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

