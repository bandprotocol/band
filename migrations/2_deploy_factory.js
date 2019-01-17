const LibTokenFactory = artifacts.require('LibTokenFactory');
const LibParametersFactory = artifacts.require('LibParametersFactory');
const LibCoreFactory = artifacts.require('LibCoreFactory');
const BandFactory = artifacts.require('BandFactory');
const AdminSimple = artifacts.require('AdminSimple');
const Voting = artifacts.require('Voting');

module.exports = function (deployer) {
  deployer.deploy(LibTokenFactory);
  deployer.deploy(LibParametersFactory);
  deployer.deploy(LibCoreFactory);
  deployer.link(LibTokenFactory, BandFactory);
  deployer.link(LibParametersFactory, BandFactory);
  deployer.link(LibCoreFactory, BandFactory);
  deployer.deploy(Voting);
  deployer
    .then(async () => {
      const bandFactory = await deployer.deploy(BandFactory, 1000000);
      await bandFactory.addVotingContract(Voting.address);
    })
    .catch(err => {
      console.log('ERROR', err);
    });

  deployer.deploy(AdminSimple);
};
