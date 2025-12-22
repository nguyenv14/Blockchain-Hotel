// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title HotelToken
 * @dev ERC20 Token cho hệ thống đặt phòng khách sạn
 * Token name: HotelCoin (HTC)
 * Admin (Owner) sẽ nắm giữ toàn bộ token ban đầu và phân phối cho users
 */
contract HotelToken is ERC20, Ownable {
    /**
     * @dev Constructor
     * - Tạo token với tên "HotelCoin" và symbol "HTC"
     * - Mint 1 triệu token cho owner (Admin) khi deploy
     * - 18 decimals là chuẩn của ERC20
     */
    constructor() ERC20("HotelCoin", "HTC") Ownable(msg.sender) {
        // Mint 1,000,000 HTC cho Admin
        // 1 triệu * 10^18 (18 decimals)
        _mint(msg.sender, 1000000 * 10**18);
    }

    /**
     * @dev Admin có thể mint thêm token nếu cần
     * @param to Địa chỉ nhận token
     * @param amount Số lượng token (đã tính decimals)
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}

