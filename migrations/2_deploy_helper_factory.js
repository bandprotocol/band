const TokenFactory = artifacts.require('TokenFactory');
const ParametersFactory = artifacts.require('ParametersFactory');
const CoreFactory = artifacts.require('CoreFactory');

module.exports = function(deployer) {
  deployer.deploy(TokenFactory);
  deployer.deploy(ParametersFactory);
  deployer.deploy(CoreFactory);
};
