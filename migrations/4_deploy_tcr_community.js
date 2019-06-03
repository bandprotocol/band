const BondingCurveExpression = artifacts.require('BondingCurveExpression');
const TCRMinDepositExpression = artifacts.require('TCRMinDepositExpression');
const CommunityFactory = artifacts.require('CommunityFactory');
const Parameters = artifacts.require('Parameters');
const TCRFactory = artifacts.require('TCRFactory');
const BandRegistry = artifacts.require('BandRegistry');

module.exports = function(deployer) {
  console.log('⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ 4');
  deployer
    .then(async () => {
      const registry = await BandRegistry.deployed();
      const commFactory = await CommunityFactory.deployed();
      const tcrFactory = await TCRFactory.deployed();
      console.log(BondingCurveExpression.address);
      const data = await commFactory.create(
        'CoinHatcher',
        'CHT',
        BondingCurveExpression.address,
        '0',
        '86400',
        '50000000000000000',
        '800000000000000000',
      );
      // console.log(data.receipt.logs);
      const coinHatcherParams = await Parameters.at(
        data.receipt.logs[2].args.params,
      );
      await tcrFactory.createTCR(
        web3.utils.fromAscii('tcr:'),
        coinHatcherParams.address,
        registry.address,
      );
    })
    .catch(console.log);
};
