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
  if (!process.env.DEPLOY_WEB_CRAWLER) return;
  deployer
    .then(async () => {
      const registry = await BandRegistry.deployed();
      const commFactory = await CommunityFactory.deployed();
      const band = await BandToken.at(await registry.band());

      const dataProviders = {
        C1: '0xda7aff0d0142ea8a6df33ba9e6307922c7838489',
        C2: '0xda7a8afb5035045a58eedecc6b6f26247c8f20f5',
        C3: '0xda7a7bd990030359e4e30e41ba0e5b33f740db47',
      };

      const tcds = [
        {
          prefix: 'web:',
          providers: ['C1', 'C2', 'C3'],
        },
      ];

      // Create Sport community
      const commTx = await commFactory.create(
        'Web Request Oracle',
        'XWB',
        BondingCurveExpression.address,
        '0',
        '60',
        '50000000000000000',
        '800000000000000000',
      );

      console.log('Created Web Oracle [bondingCurve,params,token] at', [
        commTx.receipt.logs[2].args.bondingCurve,
        commTx.receipt.logs[2].args.params,
        commTx.receipt.logs[2].args.token,
      ]);

      const tcdFactory = await OffchainAggTCDFactory.deployed();
      const commToken = await CommunityToken.at(
        commTx.receipt.logs[2].args.token,
      );
      const params = await Parameters.at(commTx.receipt.logs[2].args.params);

      await commToken.addCapper(tcdFactory.address);

      // Buy tokens
      const curve = await BondingCurve.at(
        commTx.receipt.logs[2].args.bondingCurve,
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
    })
    .catch(console.log);
};
