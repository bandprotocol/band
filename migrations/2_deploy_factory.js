const TokenFactory = artifacts.require('TokenFactory');
const ParametersFactory = artifacts.require('ParametersFactory');
const CoreFactory = artifacts.require('CoreFactory');
const BandFactory = artifacts.require('BandFactory');
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
  deployer
    .then(async () => {
      const bandFactory = await deployer.deploy(
        BandFactory,
        '1000000000000000000000000',
        TokenFactory.address,
        ParametersFactory.address,
        CoreFactory.address,
      );
      await bandFactory.addVotingContract(CommitRevealVoting.address);
      await bandFactory.addVotingContract(SimpleVoting.address);
    })
    .catch(err => {
      console.log('ERROR', err);
    });
};
