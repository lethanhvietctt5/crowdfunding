// SPDX-License-Identifier: MIT
pragma solidity >=0.8.14;

contract Project {
    string public name;
    string public description;
    address public owner;
    uint256 public minAmout;
    uint256 public targetAmount;
    uint256 public finishTime;

    address[] investorsAddress;
    mapping(address => uint256) public investorsAmount;

    constructor(
        string memory projectName,
        string memory des,
        address creator,
        uint256 min,
        uint256 target,
        uint256 finish
    ) {
        name = projectName;
        description = des;
        owner = creator;
        minAmout = min;
        targetAmount = target;
        finishTime = finish;
    }

    function contribute() public payable {
        require(msg.value >= minAmout);

        if (investorsAmount[msg.sender] == 0) {
            investorsAddress.push(msg.sender);
            investorsAmount[msg.sender] = msg.value;
        } else {
            investorsAmount[msg.sender] += msg.value;
        }
    }

    function info()
        public
        view
        returns (
            string memory,
            string memory,
            address,
            uint256,
            uint256,
            uint256
        )
    {
        return (name, description, owner, minAmout, targetAmount, finishTime);
    }

    function getInvestors() external view returns (uint256) {
        return investorsAddress.length;
    }

    function getCurrentAmountRaised() external view returns (uint256) {
        uint256 rs = 0;
        for (uint256 i = 0; i < investorsAddress.length; i++) {
            rs += investorsAmount[investorsAddress[i]];
        }
        return rs;
    }
}
