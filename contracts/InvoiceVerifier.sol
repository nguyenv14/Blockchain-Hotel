// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract InvoiceVerifier {
    // Mapping: OrderID -> Hash
    mapping(string => string) private invoiceHashes;
    
    event InvoiceCreated(string indexed orderId, string invoiceHash);

    // Ghi hash lên blockchain
    function storeHash(string memory _orderId, string memory _hash) public {
        invoiceHashes[_orderId] = _hash;
        emit InvoiceCreated(_orderId, _hash);
    }

    // Lấy hash về để kiểm tra
    function getHash(string memory _orderId) public view returns (string memory) {
        return invoiceHashes[_orderId];
    }
}

