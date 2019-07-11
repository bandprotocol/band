const BandRegistry = artifacts.require('BandRegistry');
const BandToken = artifacts.require('BandToken');
const TCDBase = artifacts.require('TCDBase');
const OffchainAggTCDFactory = artifacts.require('OffchainAggTCDFactory');
const BondingCurve = artifacts.require('BondingCurve');
const CommunityToken = artifacts.require('CommunityToken');
const BondingCurveExpression = artifacts.require('BondingCurveExpression');
const CommunityFactory = artifacts.require('CommunityFactory');
const Parameters = artifacts.require('Parameters');
const MajorityAggregator = artifacts.require('MajorityAggregator');

module.exports = function(deployer, network, accounts) {
  console.log('⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ 7');
  if (!process.env.DEPLOY_SPORT) return;
  deployer
    .then(async () => {
      const registry = await BandRegistry.deployed();
      const commFactory = await CommunityFactory.deployed();
      const band = await BandToken.at(await registry.band());

      const dataProviders = {
        ESPN: '0xda7a80e66a96ae364918ae7fcf2f9ca03e2a2d5d',
        DATA_NBA: '0xda7adcb9b801952019f8d44889a9f4038443dd97',
        SPORTS_DB: '0xda7a1ddce143c2460bd2536607ea38309d7c45ca',
      };

      const tcds = [
        {
          prefix: 'epl:',
          providers: ['ESPN', 'SPORTS_DB'],
        },
        {
          prefix: 'nba:',
          providers: ['ESPN', 'DATA_NBA'],
        },
        {
          prefix: 'mlb:',
          providers: ['ESPN'],
        },
        {
          prefix: 'nfl:',
          providers: ['ESPN'],
        },
      ];

      // Create Sport community
      const sportTx = await commFactory.create(
        'Sport Data Feeds',
        'XSP',
        BondingCurveExpression.address,
        '0',
        '60',
        '50000000000000000',
        '800000000000000000',
      );

      console.log('Created SportFeedCommunity [bondingCurve,params,token] at', [
        sportTx.receipt.logs[2].args.bondingCurve,
        sportTx.receipt.logs[2].args.params,
        sportTx.receipt.logs[2].args.token,
      ]);

      const tcdFactory = await OffchainAggTCDFactory.deployed();
      const commToken = await CommunityToken.at(
        sportTx.receipt.logs[2].args.token,
      );
      const params = await Parameters.at(sportTx.receipt.logs[2].args.params);

      await commToken.addCapper(tcdFactory.address);

      // Buy tokens
      const curve = await BondingCurve.at(
        sportTx.receipt.logs[2].args.bondingCurve,
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
        const tcdtx = await tcdFactory.createOffchainAggTCD(
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
