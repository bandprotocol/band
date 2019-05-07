const BandToken = artifacts.require('BandToken');
const BandRegistry = artifacts.require('BandRegistry');
const SimpleVoting = artifacts.require('SimpleVoting');
const CommitRevealVoting = artifacts.require('CommitRevealVoting');
const BondingCurveFactory = artifacts.require('BondingCurveFactory');
const CommunityTokenFactory = artifacts.require('CommunityTokenFactory');
const ParametersFactory = artifacts.require('ParametersFactory');
const TCDFactory = artifacts.require('TCDFactory');
const TCRFactory = artifacts.require('TCRFactory');

module.exports = function(deployer, network, accounts) {
  deployer.deploy(SimpleVoting);
  deployer.deploy(CommitRevealVoting);
  deployer.link(BondingCurveFactory, BandRegistry);
  deployer.link(CommunityTokenFactory, BandRegistry);
  deployer.link(ParametersFactory, BandRegistry);
  deployer.link(TCDFactory, BandRegistry);
  deployer.link(TCRFactory, BandRegistry);
  deployer
    .then(async () => {
      const registry = await deployer.deploy(
        BandRegistry,
        SimpleVoting.address,
        CommitRevealVoting.address,
      );
      const band = await BandToken.at(await registry.band());
      await band.mint(accounts[0], '100000000000000000000000000');

      await (await CommitRevealVoting.deployed()).setExecDelegator(
        registry.address,
      );
      await (await SimpleVoting.deployed()).setExecDelegator(registry.address);
    })
    .catch(console.log);
};
