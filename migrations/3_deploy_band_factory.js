const BandToken = artifacts.require('BandToken');
const BandRegistry = artifacts.require('BandRegistry');
const BondingCurveFactory = artifacts.require('BondingCurveFactory');
const CommunityTokenFactory = artifacts.require('CommunityTokenFactory');
const ParametersFactory = artifacts.require('ParametersFactory');
const TCDFactory = artifacts.require('TCDFactory');
const TCRFactory = artifacts.require('TCRFactory');
const BandSimpleExchange = artifacts.require('BandSimpleExchange');

module.exports = function(deployer, network, accounts) {
  deployer.link(BondingCurveFactory, BandRegistry);
  deployer.link(CommunityTokenFactory, BandRegistry);
  deployer.link(ParametersFactory, BandRegistry);
  deployer.link(TCDFactory, BandRegistry);
  deployer.link(TCRFactory, BandRegistry);
  deployer
    .then(async () => {
      const band = await deployer.deploy(BandToken);
      const exchange = await deployer.deploy(BandSimpleExchange, band.address);
      await band.mint(accounts[0], '100000000000000000000000000');
      await deployer.deploy(BandRegistry, band.address, exchange.address);
    })
    .catch(console.log);
};
