const BandRegistry = artifacts.require('BandRegistry');
const BondingCurveFactory = artifacts.require('BondingCurveFactory');
const CommunityTokenFactory = artifacts.require('CommunityTokenFactory');
const ParametersFactory = artifacts.require('ParametersFactory');
const TCDFactory = artifacts.require('TCDFactory');
const TCRFactory = artifacts.require('TCRFactory');

module.exports = function(deployer) {
  deployer.then(async () => {
    const registry = await deployer.deploy(
      BandRegistry,
      BondingCurveFactory.address,
      CommunityTokenFactory.address,
      ParametersFactory.address,
      TCDFactory.address,
      TCRFactory.address,
    );
    const band = await registry.band();
    console.log(band);
  });
};
