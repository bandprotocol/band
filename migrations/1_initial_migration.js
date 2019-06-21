const Migrations = artifacts.require('./Migrations.sol');

module.exports = function(deployer, network) {
  console.error('network:', network);
  deployer.deploy(Migrations);
};
