pragma solidity ^0.8.0;

contract GeoPrize {

    // Contract owner
    address payable public owner;

    // Location bounds
    int256 public minLatitude;
    int256 public maxLatitude;
    int256 public minLongitude;
    int256 public maxLongitude;

    // Event to emit when a reward is claimed

    constructor(int256 _minLatitude, int256 _maxLatitude, int256 _minLongitude, int256 _maxLongitude) payable{
        owner = payable(msg.sender);
        minLatitude = _minLatitude;
        maxLatitude = _maxLatitude;
        minLongitude = _minLongitude;
        maxLongitude = _maxLongitude;
    }

    function claimReward() external payable{
        // Transfer reward amount to the user
        uint256 contractBalance = address(this).balance;
        require(contractBalance > 0, "There are no funds available in the smart contract.");

        payable(msg.sender).transfer(contractBalance);
    }

    // Function to allow the owner to withdraw the contract balance
    function withdraw() external {
        require(msg.sender == owner, "Only the owner can withdraw.");
        owner.transfer(address(this).balance);
    }
}
