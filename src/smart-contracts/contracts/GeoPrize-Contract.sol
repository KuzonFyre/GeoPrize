pragma solidity ^0.8.0;

contract GeoPrize {

    // Contract owner
    address payable public owner;

    // Location bounds
    int256 public minLatitude;
    int256 public maxLatitude;
    int256 public minLongitude;
    int256 public maxLongitude;
    int256 public multiplier;
    address payable public recipient;

    // Event to emit when a reward is claimed

    constructor(int256 _minLatitude, int256 _maxLatitude, int256 _minLongitude, int256 _maxLongitude, int256 _multiplier, address _recipient) payable{
        owner = payable(msg.sender);
        minLatitude = _minLatitude;
        maxLatitude = _maxLatitude;
        minLongitude = _minLongitude;
        maxLongitude = _maxLongitude;
        multiplier = _multiplier;
        recipient = payable(_recipient);
    }

    function claimReward(int256 latitude, int256 longitude) external payable{
        require(msg.sender == recipient, "Only the recipient can redeem the award");
        // Transfer reward amount to the user
        uint256 contractBalance = address(this).balance;
        require(
        latitude >= minLatitude && latitude <= maxLatitude &&
        longitude >= minLongitude && longitude <= maxLongitude,
        "User is not within the specified geolocation bounds."
    );
        require(contractBalance > 0, "There are no funds available in the smart contract.");

        recipient.transfer(contractBalance);
    }

    function deposit() external payable {
        require(msg.sender == owner, "Only the owner can deposit");
        require(msg.value > 0, "You must send a positive amount of Ether.");
    }

    // Function to allow the owner to withdraw the contract balance
    function withdraw() external {
        require(msg.sender == owner, "Only the owner can withdraw.");
        owner.transfer(address(this).balance);
    }
}
