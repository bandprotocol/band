const BandRegistry = artifacts.require('BandRegistry');
const BandToken = artifacts.require('BandToken');
const TCDBase = artifacts.require('TCDBase');
const AggTCDFactory = artifacts.require('AggTCDFactory');
const BondingCurve = artifacts.require('BondingCurve');
const CommunityToken = artifacts.require('CommunityToken');
const BondingCurveExpression = artifacts.require('BondingCurveExpression');
const CommunityFactory = artifacts.require('CommunityFactory');
const Parameters = artifacts.require('Parameters');
const MajorityAggregator = artifacts.require('MajorityAggregator');
const MockDataSource = artifacts.require('MockDataSource');

module.exports = function(deployer, network, accounts) {
  console.log('⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ 6');
  if (!process.env.DEPLOY_LOTTERY) return;
  deployer
    .then(async () => {
      const registry = await BandRegistry.deployed();
      const commFactory = await CommunityFactory.deployed();
      const band = await BandToken.at(await registry.band());
      let dataProviders;

      if (network === 'development') {
        dataProviders = [];
        for (let i = 0; i < 3; i++) {
          const source = await deployer.deploy(
            MockDataSource,
            'lottery_data_source' + (i + 1),
          );
          dataProviders.push(await source.address);
          console.log(await source.address);
          console.log(await source.owner());
        }
      } else {
        dataProviders = [
          '0x1e84754D96E5caAB92c9b2Ac3b6EC2BB6a109FF6',
          '0xB91BA347625F6dE60Be8A6729a5AB05f30AC3dca',
          '0xb21bA08F615BAE1C5d39fE5426c7eB191235188C',
        ];
      }
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
      const tcdFactory = await AggTCDFactory.deployed();
      const commToken = await CommunityToken.at(
        lotteryTx.receipt.logs[2].args.token,
      );
      const params = await Parameters.at(lotteryTx.receipt.logs[2].args.params);
      await params.setRaw(
        [
          web3.utils.fromAscii('data:min_provider_stake'),
          web3.utils.fromAscii('data:max_provider_count'),
          web3.utils.fromAscii('data:owner_revenue_pct'),
          web3.utils.fromAscii('data:query_price'),
          web3.utils.fromAscii('data:withdraw_delay'),
          web3.utils.fromAscii('data:data_aggregator'),
        ],
        [
          '500000000000000000000',
          '3',
          '500000000000000000',
          '1000000000000000',
          '259200',
          MajorityAggregator.address,
        ],
      );
      await commToken.addCapper(tcdFactory.address);

      const lotteryTCDTx = await tcdFactory.createTCD(
        web3.utils.fromAscii('data:'),
        lotteryTx.receipt.logs[2].args.bondingCurve,
        registry.address,
        lotteryTx.receipt.logs[2].args.params,
      );

      const lotteryTCD = await TCDBase.at(
        lotteryTCDTx.receipt.logs[0].args.atcd,
      );
      console.log('Created Lottery TCD at', lotteryTCD.address);
      console.error(
        'DataSourceBookkeepingLotteryAddress:',
        JSON.stringify([lotteryTCD.address]),
      );
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

      // Add register
      await commToken.approve(lotteryTCD.address, '1000000000000000000000000');

      const address0 = '0x0000000000000000000000000000000000000000';
      await Promise.all(
        dataProviders.map(async dataSource =>
          lotteryTCD.register(dataSource, address0, '500000000000000000000'),
        ),
      );
    })
    .catch(console.log);
};
