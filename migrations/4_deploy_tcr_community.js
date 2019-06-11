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
      await coinHatcherParams.setRaw(
        [
          web3.utils.fromAscii('tcr:min_deposit'),
          web3.utils.fromAscii('tcr:apply_stage_length'),
          web3.utils.fromAscii('tcr:dispensation_percentage'),
          web3.utils.fromAscii('tcr:commit_time'),
          web3.utils.fromAscii('tcr:reveal_time'),
          web3.utils.fromAscii('tcr:min_participation_pct'),
          web3.utils.fromAscii('tcr:support_required_pct'),
          web3.utils.fromAscii('tcr:deposit_decay_function'),
        ],
        [
          '100000000000000000000',
          '60',
          '500000000000000000',
          '60',
          '60',
          '100000000000000000',
          '500000000000000000',
          TCRMinDepositExpression.address,
        ],
      );

      await tcrFactory.createTCR(
        web3.utils.fromAscii('tcr:'),
        coinHatcherParams.address,
        registry.address,
      );
    })
    .catch(console.log);
};
