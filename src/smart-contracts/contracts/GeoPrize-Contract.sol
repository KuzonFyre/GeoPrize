pragma solidity ^0.8.0;

contract GeoPrize {

    // Contract owner
    address payable public owner;

    // Location bounds
    int256 public minLatitude;
    int256 public maxLatitude;
    int256 public minLongitude;
    int256 public maxLongitude;

    // Reward amount
    uint256 public rewardAmount;

    // Event to emit when a reward is claimed
    event RewardClaimed(address indexed user, uint256 amount);

    constructor(int256 _minLatitude, int256 _maxLatitude, int256 _minLongitude, int256 _maxLongitude, uint256 _rewardAmount) {
        owner = payable(msg.sender);
        minLatitude = _minLatitude;
        maxLatitude = _maxLatitude;
        minLongitude = _minLongitude;
        maxLongitude = _maxLongitude;
        rewardAmount = _rewardAmount;
    }

    function claimReward(int256 latitude, int256 longitude) external payable {
        require(msg.value >= rewardAmount, "Not enough Ether sent to claim reward.");
        require(isWithinBounds(latitude, longitude), "The provided coordinates are not within the specified bounds.");

        // Refund any excess Ether
        if (msg.value > rewardAmount) {
            uint256 refundAmount = msg.value - rewardAmount;
            payable(msg.sender).transfer(refundAmount);
        }

        // Transfer reward amount to the user
        payable(msg.sender).transfer(rewardAmount);

        emit RewardClaimed(msg.sender, rewardAmount);
    }

    function isWithinBounds(int256 latitude, int256 longitude) public view returns (bool) {
        return (latitude >= minLatitude && latitude <= maxLatitude && longitude >= minLongitude && longitude <= maxLongitude);
    }

    // Function to allow the owner to withdraw the contract balance
    function withdraw() external {
        require(msg.sender == owner, "Only the owner can withdraw.");
        owner.transfer(address(this).balance);
    }
}
