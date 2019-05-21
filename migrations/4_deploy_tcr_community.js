const BandRegistry = artifacts.require('BandRegistry');
const CommunityCore = artifacts.require('CommunityCore');
const BondingCurveExpression = artifacts.require('BondingCurveExpression');
const TCRMinDepositExpression = artifacts.require('TCRMinDepositExpression');

module.exports = function(deployer) {
  deployer
    .then(async () => {
      const registry = await BandRegistry.deployed();
      const data = await registry.createCommunity(
        'CoinHatcher',
        'CHT',
        BondingCurveExpression.address,
        '0',
        '86400',
        '50000000000000000',
        '800000000000000000',
      );
      // console.log(data.receipt.logs);
      const coinHatcher = await CommunityCore.at(
        data.receipt.logs[1].args.community,
      );
      await coinHatcher.createTCR(
        web3.utils.fromAscii('tcr:'),
        TCRMinDepositExpression.address,
        '100000000000000000000',
        '21600',
        '500000000000000000',
        '43200',
        '3600',
        '100000000000000000',
        '500000000000000000',
      );
    })
    .catch(console.log);
};
