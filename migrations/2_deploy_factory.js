const LibTokenFactory = artifacts.require('LibTokenFactory');
const LibParametersFactory = artifacts.require('LibParametersFactory');
const LibCoreFactory = artifacts.require('LibCoreFactory');
const BandFactory = artifacts.require('BandFactory');
const AdminSimple = artifacts.require('AdminSimple');
const CommitRevealVoting = artifacts.require('CommitRevealVoting');
const SimpleVoting = artifacts.require('SimpleVoting');

module.exports = function (deployer) {
  deployer.deploy(LibTokenFactory);
  deployer.deploy(LibParametersFactory);
  deployer.deploy(LibCoreFactory);
  deployer.link(LibTokenFactory, BandFactory);
  deployer.link(LibParametersFactory, BandFactory);
  deployer.link(LibCoreFactory, BandFactory);
  deployer.deploy(CommitRevealVoting);
  deployer.deploy(SimpleVoting);
  deployer.deploy(AdminSimple);
  deployer
    .then(async () => {
      const bandFactory = await deployer.deploy(BandFactory, 1000000);
      await bandFactory.addVotingContract(CommitRevealVoting.address);
      await bandFactory.addVotingContract(SimpleVoting.address);
    })
    .catch(err => {
      console.log('ERROR', err);
    });
};
