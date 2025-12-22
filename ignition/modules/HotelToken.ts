import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

/**
 * Module để deploy HotelToken contract
 * 
 * Usage:
 * npx hardhat ignition deploy ignition/modules/HotelToken.ts --network localhost
 */
const HotelTokenModule = buildModule("HotelTokenModule", (m) => {
  // Deploy HotelToken contract
  // Constructor không cần tham số
  const hotelToken = m.contract("HotelToken");

  return { hotelToken };
});

export default HotelTokenModule;

