// scripts/deposit-eth.ts
// Script để nạp ETH cho user (Admin chuyển ETH trực tiếp cho User)

import { ethers } from "hardhat";

/**
 * Nạp ETH cho user
 * @param userWalletAddress Địa chỉ ví của user
 * @param amountETH Số lượng ETH cần nạp (ví dụ: 0.001 ETH)
 */
async function processDeposit(userWalletAddress: string, amountETH: number) {
  // 1. Setup Admin Wallet
  // Admin phải là người có nhiều ETH nhất trong mạng (Account #0)
  const [admin] = await ethers.getSigners();

  console.log("👤 Admin address:", admin.address);
  console.log("💰 Admin balance:", ethers.formatEther(await ethers.provider.getBalance(admin.address)), "ETH");
  console.log("📥 User address:", userWalletAddress);
  console.log("💵 Amount to deposit:", amountETH, "ETH");

  // 2. Kiểm tra số dư admin có đủ không
  const adminBalance = await ethers.provider.getBalance(admin.address);
  const amountInWei = ethers.parseEther(amountETH.toString());

  if (adminBalance < amountInWei) {
    throw new Error(
      `Admin không đủ ETH! Cần ${amountETH} ETH nhưng chỉ có ${ethers.formatEther(adminBalance)} ETH`
    );
  }

  // 3. Chuyển ETH (Đơn giản hơn Token rất nhiều)
  console.log(`\n🔄 Đang chuyển ${amountETH} ETH cho ${userWalletAddress}...`);

  const tx = await admin.sendTransaction({
    to: userWalletAddress,
    value: amountInWei, // Đổi số sang Wei
  });

  console.log("⏳ Transaction hash:", tx.hash);
  console.log("⏳ Đang chờ xác nhận...");

  const receipt = await tx.wait();
  console.log("✅ Nạp thành công!");
  console.log("📋 Transaction receipt:", {
    hash: receipt?.hash,
    blockNumber: receipt?.blockNumber,
    gasUsed: receipt?.gasUsed?.toString(),
  });

  // 4. Kiểm tra số dư user sau khi nạp
  const userBalance = await ethers.provider.getBalance(userWalletAddress);
  console.log("\n💰 Số dư user sau khi nạp:", ethers.formatEther(userBalance), "ETH");
}

// Chạy thử: Nạp 0.001 ETH cho user
// Thay đổi địa chỉ ví user và số lượng ETH theo nhu cầu
async function main() {
  const userAddress = process.env.USER_WALLET_ADDRESS || "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
  const amountETH = parseFloat(process.env.DEPOSIT_AMOUNT || "0.001");

  try {
    await processDeposit(userAddress, amountETH);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

// Chạy script
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

