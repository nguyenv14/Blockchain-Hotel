import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

/**
 * Module để deploy cả HotelToken và HotelBooking cùng lúc
 * HotelBooking sẽ tự động sử dụng địa chỉ HotelToken vừa deploy
 * 
 * Usage:
 * npx hardhat ignition deploy ignition/modules/HotelBookingWithToken.ts --network localhost
 */
const HotelBookingWithTokenModule = buildModule("HotelBookingWithTokenModule", (m) => {
  // Bước 1: Deploy HotelToken trước
  const hotelToken = m.contract("HotelToken");

  // Bước 2: Deploy HotelBooking với địa chỉ HotelToken vừa deploy
  const hotelBooking = m.contract("HotelBooking", [hotelToken]);

  return { hotelToken, hotelBooking };
});

export default HotelBookingWithTokenModule;

