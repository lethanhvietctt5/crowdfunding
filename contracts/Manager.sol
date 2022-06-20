// SPDX-License-Identifier: MIT
pragma solidity >=0.8.14;
import "./Project.sol";

contract Manager {
    address[] projects;

    event CreateProject(address projectAddress);

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
        emit CreateProject(address(newProject));
    }

    function getProjects() external view returns (address[] memory) {
        return projects;
    }
}
