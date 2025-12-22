// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Payment {
    // Biến lưu địa chỉ của chủ cửa hàng (là bạn)
    address public owner;

    // Sự kiện: Báo cho Frontend biết khi có người thanh toán thành công
    event PaymentReceived(address indexed from, uint256 amount, string orderId);

    constructor() {
        // Khi deploy, ai chạy lệnh deploy thì người đó là chủ (Owner)
        owner = msg.sender;
    }

    // Hàm nhận tiền thanh toán
    // orderId: Mã đơn hàng từ DB của bạn (ví dụ: "ORDER_123")
    function pay(string memory orderId) public payable {
        require(msg.value > 0, "So tien phai lon hon 0");
        
        // Ghi sự kiện lên blockchain (để Web bắt được và cập nhật trạng thái đơn hàng)
        emit PaymentReceived(msg.sender, msg.value, orderId);
    }

    // Hàm rút tiền về ví thật (chỉ Owner mới gọi được)
    function withdraw() public {
        require(msg.sender == owner, "Ban khong phai chu cua hang");
        payable(owner).transfer(address(this).balance);
    }
}