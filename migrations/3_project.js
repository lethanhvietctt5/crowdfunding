const Project = artifacts.require("Project");

module.exports = function (deployer) {
  deployer.deploy(
    Project,
    "Origin Project",
    "",
    "0x9Ab481754B24465C159E4C33dC5D95141483948f",
    0,
    0,
    new Date().getTime()
  );
};
