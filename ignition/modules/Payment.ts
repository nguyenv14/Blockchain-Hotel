import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const PaymentModule = buildModule("PaymentModule", (m) => {
  // Lệnh này bảo Hardhat hãy deploy contract tên là "Payment"
  const payment = m.contract("Payment");

  return { payment };
});

export default PaymentModule;