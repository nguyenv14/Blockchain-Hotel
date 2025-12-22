// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract HotelBooking is Ownable {
    
    struct Room {
        uint256 id;
        uint256 price; // Giá tính bằng ETH (wei)
        bool isBooked;
        address bookedBy;
    }

    mapping(uint256 => Room) public rooms;
    
    event RoomBooked(uint256 roomId, address user, uint256 price);

    // Không cần truyền địa chỉ Token nữa
    constructor() Ownable(msg.sender) {}

    // Set giá phòng (Ví dụ 1 ETH = 10^18 wei)
    function setRoom(uint256 _id, uint256 _priceInWei) external onlyOwner {
        rooms[_id] = Room(_id, _priceInWei, false, address(0));
    }

    // Hàm bookRoom thêm từ khóa 'payable' để nhận được ETH
    function bookRoom(uint256 _id) external payable {
        Room storage room = rooms[_id];
        require(!room.isBooked, "Phong da co nguoi dat");
        require(room.price > 0, "Phong khong ton tai");
        
        // KIỂM TRA: Tiền gửi kèm (msg.value) có bằng giá phòng không?
        require(msg.value == room.price, "Vui long gui dung so tien phong");

        // Logic đặt phòng
        room.isBooked = true;
        room.bookedBy = msg.sender;

        emit RoomBooked(_id, msg.sender, msg.value);
    }

    // Admin rút toàn bộ ETH về ví
    function withdrawETH() external onlyOwner {
        // Chuyển toàn bộ số dư của contract về ví chủ
        payable(owner()).transfer(address(this).balance);
    }

    /**
     * @dev Lấy thông tin phòng
     * @param _id ID của phòng
     * @return Room struct với thông tin phòng
     */
    function getRoom(uint256 _id) external view returns (Room memory) {
        return rooms[_id];
    }

    /**
     * @dev Kiểm tra phòng có sẵn không
     * @param _id ID của phòng
     * @return true nếu phòng sẵn sàng, false nếu đã được đặt hoặc không tồn tại
     */
    function isRoomAvailable(uint256 _id) external view returns (bool) {
        Room memory room = rooms[_id];
        return !room.isBooked && room.price > 0;
    }
}
