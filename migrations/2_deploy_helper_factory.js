const TokenFactory = artifacts.require('TokenFactory');
const ParametersFactory = artifacts.require('ParametersFactory');
const CoreFactory = artifacts.require('CoreFactory');
const AdminSimple = artifacts.require('AdminSimple');
const CommitRevealVoting = artifacts.require('CommitRevealVoting');
const SimpleVoting = artifacts.require('SimpleVoting');

module.exports = function(deployer) {
  deployer.deploy(TokenFactory);
  deployer.deploy(ParametersFactory);
  deployer.deploy(CoreFactory);
  deployer.deploy(CommitRevealVoting);
  deployer.deploy(SimpleVoting);
  deployer.deploy(AdminSimple);
};
