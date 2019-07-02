const BandRegistry = artifacts.require('BandRegistry');
const BandToken = artifacts.require('BandToken');
const TCDBase = artifacts.require('TCDBase');
const MultiSigTCDFactory = artifacts.require('MultiSigTCDFactory');
const BondingCurve = artifacts.require('BondingCurve');
const CommunityToken = artifacts.require('CommunityToken');
const BondingCurveExpression = artifacts.require('BondingCurveExpression');
const CommunityFactory = artifacts.require('CommunityFactory');
const Parameters = artifacts.require('Parameters');
const MajorityAggregator = artifacts.require('MajorityAggregator');

module.exports = function(deployer, network, accounts) {
  console.log('⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ 6');
  if (!process.env.DEPLOY_LOTTERY) return;
  deployer
    .then(async () => {
      const registry = await BandRegistry.deployed();
      const commFactory = await CommunityFactory.deployed();
      const band = await BandToken.at(await registry.band());

      const dataProviders = {
        DATA_NY_GOV: '0xda7a198618105fd301958ca76548ce9ea5d1de42',
        POWERBALL: '0xda7ad157eda297c1412bbdbe0e3600670e4560f6',
        MEGA_MILLIONS: '0xda7a08e515dab7cec794f804ce2b1c850ff19b7f',
      };

      const tcds = [
        {
          prefix: 'pwb:',
          providers: ['DATA_NY_GOV', 'POWERBALL'],
        },
        {
          prefix: 'mmn:',
          providers: ['DATA_NY_GOV', 'MEGA_MILLIONS'],
        },
      ];
      // Create Lottery community
      const lotteryTx = await commFactory.create(
        'Lottery Data Feeds',
        'XLT',
        BondingCurveExpression.address,
        '0',
        '86400',
        '50000000000000000',
        '800000000000000000',
      );

      console.log(
        'Created LotteryFeedCommunity [bondingCurve,params,token] at',
        [
          lotteryTx.receipt.logs[2].args.bondingCurve,
          lotteryTx.receipt.logs[2].args.params,
          lotteryTx.receipt.logs[2].args.token,
        ],
      );
      const tcdFactory = await MultiSigTCDFactory.deployed();
      const commToken = await CommunityToken.at(
        lotteryTx.receipt.logs[2].args.token,
      );
      const params = await Parameters.at(lotteryTx.receipt.logs[2].args.params);
      await commToken.addCapper(tcdFactory.address);

      // Buy tokens
      const curve = await BondingCurve.at(
        lotteryTx.receipt.logs[2].args.bondingCurve,
      );

      await band.approve(curve.address, '620000000000000148973918');
      await curve.buy(
        accounts[0],
        '620000000000000148973918',
        '1000000000000000000000000',
      );

      const address0 = '0x0000000000000000000000000000000000000000';
      const tcdList = [];
      for (const tcdDetail of tcds) {
        await params.setRaw(
          [
            web3.utils.fromAscii(tcdDetail.prefix + 'min_provider_stake'),
            web3.utils.fromAscii(tcdDetail.prefix + 'max_provider_count'),
            web3.utils.fromAscii(tcdDetail.prefix + 'owner_revenue_pct'),
            web3.utils.fromAscii(tcdDetail.prefix + 'query_price'),
            web3.utils.fromAscii(tcdDetail.prefix + 'withdraw_delay'),
            web3.utils.fromAscii(tcdDetail.prefix + 'data_aggregator'),
          ],
          [
            '500000000000000000000',
            tcdDetail.providers.length,
            '500000000000000000',
            '1000000000000000',
            '259200',
            MajorityAggregator.address,
          ],
        );
        const tcdtx = await tcdFactory.createMultiSigTCD(
          web3.utils.fromAscii(tcdDetail.prefix),
          curve.address,
          registry.address,
          params.address,
        );
        const tcd = await TCDBase.at(tcdtx.receipt.logs[0].args.mtcd);
        console.log('Created', tcdDetail.prefix, 'TCD at', tcd.address);
        tcdList.push(tcd.address);

        await Promise.all(
          tcdDetail.providers.map(async provider => {
            tcd.register(
              dataProviders[provider],
              address0,
              '500000000000000000000',
            );
          }),
        );
      }

      console.error(
        'DataSourceBookkeepingSportAddress:',
        JSON.stringify(tcdList),
      );
    })
    .catch(console.log);
};
