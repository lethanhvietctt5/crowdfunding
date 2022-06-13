// SPDX-License-Identifier: MIT
pragma solidity >=0.8.14;
import "./Project.sol";

contract Manager {
    address[] projects;

    function createProject(
        string memory name,
        string memory des,
        address creator,
        uint256 min,
        uint256 target,
        uint256 finishTime
    ) public {
        Project newProject = new Project(
            name,
            des,
            creator,
            min,
            target,
            finishTime
        );

        projects.push(address(newProject));
    }
}
