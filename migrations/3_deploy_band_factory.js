const TokenFactory = artifacts.require('TokenFactory');
const ParametersFactory = artifacts.require('ParametersFactory');
const CoreFactory = artifacts.require('CoreFactory');
const BandFactory = artifacts.require('BandFactory');
const CommitRevealVoting = artifacts.require('CommitRevealVoting');
const SimpleVoting = artifacts.require('SimpleVoting');

module.exports = function(deployer) {
  deployer
    .then(async () => {
      const bandFactory = await deployer.deploy(
        BandFactory,
        '100000000000000000000000000',
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
