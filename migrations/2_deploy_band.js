const BandToken = artifacts.require('./BandToken.sol');
const AdminSimple = artifacts.require('./AdminSimple.sol');

module.exports = function (deployer) {
  deployer.deploy(BandToken, '100000000000000000000000000');
  deployer.deploy(AdminSimple);
};
