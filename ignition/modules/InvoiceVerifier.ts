import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const InvoiceVerifierModule = buildModule("InvoiceVerifierModule", (m) => {
  const invoiceVerifier = m.contract("InvoiceVerifier");

  return { invoiceVerifier };
});

export default InvoiceVerifierModule;

