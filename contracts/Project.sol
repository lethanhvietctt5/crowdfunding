// SPDX-License-Identifier: MIT
pragma solidity >=0.8.14;

contract Project {
    struct Request {
        uint256 amount;
        string description;
        address payable recipient;
        bool isDone;
        uint256 accreditCount;
        mapping(address => bool) investorsAccredited;
    }

    string public name;
    string public description;
    address public owner;
    uint256 public minAmout;
    uint256 public targetAmount;
    uint256 public finishTime;

    uint256 public reqIndex;
    mapping(uint256 => Request) public requests;

    address[] investorsAddress;
    mapping(address => uint256) public investorsAmount;

    modifier onlyOwner() {
        require(msg.sender == owner, 'Sender not authorized.');
        _;
    }

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
        reqIndex = 0;
    }

    function contribute() public payable {
        require(msg.value >= minAmout, "Insufficient amount");

        if (investorsAmount[msg.sender] == 0) {
            investorsAddress.push(msg.sender);
            investorsAmount[msg.sender] = msg.value;
        } else {
            investorsAmount[msg.sender] += msg.value;
        }
    }

    function createRequest(uint256 amount, string memory desc, address payable recipient) public onlyOwner {
        Request storage newReq = requests[reqIndex++];
        newReq.amount = amount;
        newReq.description = desc;
        newReq.recipient = recipient;
        newReq.isDone = false;
        newReq.accreditCount = 0;
    }

    function accreditRequest(uint256 ind) public {
        Request storage request = requests[ind];

        require(investorsAmount[msg.sender] > 0, "Not an investor");
        require(!request.investorsAccredited[msg.sender], "Has already given credit for");
        require(!request.isDone, "Request has already been accredited");

        request.investorsAccredited[msg.sender] = true;
        request.accreditCount++;
    }

    function resolveRequest(uint256 ind) public onlyOwner {
        Request storage request = requests[ind];

        require(request.accreditCount > (investorsAddress.length / 2), "Not enough votes");
        require(!request.isDone, "Has been done");

        request.recipient.transfer(request.amount);
    }

    function getIsAccreditedRequest(uint256 ind) external view returns (bool) {
        Request storage req = requests[ind];
        return req.investorsAccredited[msg.sender];
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
            uint256,
            uint256
        )
    {
        return (name, description, owner, minAmout, targetAmount, finishTime, address(this).balance);
    }

    function getInvestors() external view returns (uint256) {
        return investorsAddress.length;
    }

    function getInvestorsAddress() external view returns (address[] memory) {
        return investorsAddress;
    }
}
