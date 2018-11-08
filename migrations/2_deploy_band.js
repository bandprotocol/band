
const BandToken = artifacts.require('./BandToken.sol');

module.exports = function (deployer) {
  deployer.deploy(
    BandToken,
    "200000000000000000000",
  )
};
