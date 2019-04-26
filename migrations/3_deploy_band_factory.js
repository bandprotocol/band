const TokenFactory = artifacts.require('TokenFactory');
const ParametersFactory = artifacts.require('ParametersFactory');
const CoreFactory = artifacts.require('CoreFactory');
const BandFactory = artifacts.require('BandFactory');
const TCRFactory = artifacts.require('TCRFactory');
const DelegatStakeDelegatedDataSourceFactory = artifacts.require(
  'StakeDelegatedDataSourceFactory',
);

module.exports = function(deployer) {
  deployer.deploy(
    BandFactory,
    '100000000000000000000000000',
    TokenFactory.address,
    ParametersFactory.address,
    CoreFactory.address,
  );
  deployer.deploy(TCRFactory);
  deployer.deploy(DelegatStakeDelegatedDataSourceFactory);
};
