const TokenFactory = artifacts.require('TokenFactory');
const ParametersFactory = artifacts.require('ParametersFactory');
const CoreFactory = artifacts.require('CoreFactory');
const BandFactory = artifacts.require('BandFactory');

module.exports = function(deployer) {
  deployer
    .then(async () => {
      await deployer.deploy(
        BandFactory,
        '100000000000000000000000000',
        TokenFactory.address,
        ParametersFactory.address,
        CoreFactory.address,
      );
    })
    .catch(err => {
      console.log('ERROR', err);
    });
};
