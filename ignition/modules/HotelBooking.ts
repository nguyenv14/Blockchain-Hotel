import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

/**
 * Module để deploy HotelBooking contract
 * 
 * Usage:
 * npx hardhat ignition deploy ignition/modules/HotelBooking.ts --network localhost --parameters '{"HotelBookingModule":{"tokenAddress":"0x..."}}'
 * 
 * Hoặc nếu đã deploy HotelToken trước đó, có thể reference:
 * npx hardhat ignition deploy ignition/modules/HotelBooking.ts --network localhost --parameters '{"HotelBookingModule":{"tokenAddress":"0x5FbDB2315678afecb367f032d93F642f64180aa3"}}'
 */
const HotelBookingModule = buildModule("HotelBookingModule", (m) => {
  // Lấy địa chỉ HotelToken từ parameter hoặc từ deployment trước
  // Nếu không có parameter, sẽ dùng giá trị mặc định (cần update sau khi deploy HotelToken)
  const tokenAddress = m.getParameter("tokenAddress", "0x0000000000000000000000000000000000000000");

  // Deploy HotelBooking contract với địa chỉ HotelToken
  const hotelBooking = m.contract("HotelBooking", [tokenAddress]);

  return { hotelBooking };
});

export default HotelBookingModule;

