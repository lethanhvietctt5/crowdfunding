const Project = artifacts.require("Project");

module.exports = function (deployer) {
  deployer.deploy(
    Project,
    "Origin Project",
    "",
    "0x00EfF82E61F63135eb225E0238B082DDf7de413b",
    0,
    0,
    new Date().getTime()
  );
};
