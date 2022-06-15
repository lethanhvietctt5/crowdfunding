const Project = artifacts.require("Project");

module.exports = function (deployer) {
  deployer.deploy(
    Project,
    "Origin Project",
    "",
    "0xAd1B6C9948eb2b2F4EbaaE82b8c43212927C609a",
    0,
    0,
    new Date().getTime()
  );
};
