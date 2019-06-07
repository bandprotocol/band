const BandToken = artifacts.require('BandToken');
const BandRegistry = artifacts.require('BandRegistry');
const BondingCurveFactory = artifacts.require('BondingCurveFactory');
const CommunityTokenFactory = artifacts.require('CommunityTokenFactory');
const ParametersFactory = artifacts.require('ParametersFactory');
const BandMockExchange = artifacts.require('BandMockExchange');
const CommunityFactory = artifacts.require('CommunityFactory');
const TCRFactory = artifacts.require('TCRFactory');
const AggTCDFactory = artifacts.require('AggTCDFactory');
const MultiSigTCDFactory = artifacts.require('MultiSigTCDFactory');

module.exports = function(deployer, network, accounts) {
  console.log('⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ 3');
  deployer.link(BondingCurveFactory, CommunityFactory);
  deployer.link(CommunityTokenFactory, CommunityFactory);
  deployer.link(ParametersFactory, CommunityFactory);
  deployer.deploy(AggTCDFactory);
  deployer.deploy(MultiSigTCDFactory);
  deployer.deploy(TCRFactory);
  deployer
    .then(async () => {
      const block = await web3.eth.getBlock('latest');
      console.error('blockId:', block.number);
      console.error('blockHash:', block.hash);
      console.error('blockParentHash:', block.parentHash);
      console.error('blockTime:', block.timestamp);
      const band = await deployer.deploy(BandToken);
      /// Use Uniswap in production
      const exchange = await deployer.deploy(BandMockExchange, band.address);
      await band.mint(accounts[0], '100000000000000000000000000');
      const bandRegistry = await deployer.deploy(
        BandRegistry,
        band.address,
        exchange.address,
      );

      await deployer.deploy(CommunityFactory, bandRegistry.address);
      console.error('CommunityFactory:', CommunityFactory.address);
      console.error('bandRegistry:', bandRegistry.address);
      console.error('AggTCDFactory:', AggTCDFactory.address);
      console.error('MultiSigTCDFactory:', MultiSigTCDFactory.address);
      console.error('TCRFactory:', TCRFactory.address);
    })
    .catch(console.log);
};
