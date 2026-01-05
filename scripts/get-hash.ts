import hre from "hardhat";
import { ethers } from "ethers";
import fs from "fs";
import path from "path";

async function main() {
  const orderId = process.env.ORDER_CODE;
  const contractAddress = process.env.CONTRACT_ADDR;

  if (!orderId || !contractAddress) {
    console.error(JSON.stringify({
      status: "error",
      message: "Missing required environment variables: ORDER_CODE, CONTRACT_ADDR"
    }));
    process.exit(1);
  }

  // 1. Tạo ethers provider từ Hardhat network
  // Hardhat network URL thường là http://127.0.0.1:8545 cho localhost
  const networkUrl = "http://127.0.0.1:8545"
  const provider = new ethers.JsonRpcProvider(networkUrl);

  // 2. Đọc ABI thủ công (KHÔNG dùng getContractFactory)
  // ES modules không có __dirname, dùng import.meta.url
  // Xử lý URL encoding và Windows path
  const fileUrl = new URL(import.meta.url);
  let __filename = fileUrl.pathname;
  
  // Decode URL encoding (ví dụ: %E1%BB%8Dc -> ọc)
  if (process.platform === 'win32') {
    __filename = decodeURIComponent(__filename);
    // Fix Windows path: /D:/... -> D:\...
    __filename = __filename.replace(/^\/([A-Z]:)/, '$1').replace(/\//g, '\\');
  } else {
    __filename = decodeURIComponent(__filename);
  }
  
  const __dirname = path.dirname(__filename);
  const artifactPath = path.join(
    __dirname,
    "..",
    "artifacts",
    "contracts",
    "InvoiceVerifier.sol",
    "InvoiceVerifier.json"
  );

  // Kiểm tra file có tồn tại không
  if (!fs.existsSync(artifactPath)) {
    console.error(JSON.stringify({
      status: "error",
      message: `Artifact file not found: ${artifactPath}. Please compile contracts first with 'npx hardhat compile'`
    }));
    process.exit(1);
  }

  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
  const abi = artifact.abi;

  // 3. Khởi tạo contract (read-only)
  const contract = new ethers.Contract(
    contractAddress,
    abi,
    provider as any
  );

  try {
    const hash = await contract.getHash(orderId);

    console.log(JSON.stringify({
      status: "success",
      order_id: orderId,
      hash: hash.toString()
    }));
  } catch (error: any) {
    console.error(JSON.stringify({
      status: "error",
      message: error.message ?? String(error)
    }));
    process.exit(1);
  }
}

main();
