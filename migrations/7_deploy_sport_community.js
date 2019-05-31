const BandRegistry = artifacts.require('BandRegistry');
const BandToken = artifacts.require('BandToken');
const TCD = artifacts.require('TCD');
const TCDFactory = artifacts.require('TCDFactory');
const BondingCurve = artifacts.require('BondingCurve');
const CommunityToken = artifacts.require('CommunityToken');
const BondingCurveExpression = artifacts.require('BondingCurveExpression');
const CommunityFactory = artifacts.require('CommunityFactory');
const Parameters = artifacts.require('Parameters');

module.exports = function(deployer, network, accounts) {
  console.log('⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ 7');
  deployer
    .then(async () => {
      const registry = await BandRegistry.deployed();
      const commFactory = await CommunityFactory.deployed();
      const band = await BandToken.at(await registry.band());
      const dataProviders = [
        '0x2F17B485FA21779F3aAEb1C32E2EC4Dc1A3c366F',
        '0xF2c23e8A18715a06b792c1191c3b6DdBE26fE6c3',
      ];
      // Create Sport community
      const sportTx = await commFactory.create(
        'SportFeedCommunity',
        'SFC',
        BondingCurveExpression.address,
        '0',
        '86400',
        '50000000000000000',
        '800000000000000000',
      );

      console.log('Created SportFeedCommunity [bondingCurve,params,token] at', [
        sportTx.receipt.logs[2].args.bondingCurve,
        sportTx.receipt.logs[2].args.params,
        sportTx.receipt.logs[2].args.token,
      ]);

      const tcdFactory = await TCDFactory.deployed();
      const commToken = await CommunityToken.at(
        sportTx.receipt.logs[2].args.token,
      );
      const params = await Parameters.at(sportTx.receipt.logs[2].args.params);
      await params.setRaw(
        [
          web3.utils.fromAscii('data:min_provider_stake'),
          web3.utils.fromAscii('data:max_provider_count'),
          web3.utils.fromAscii('data:owner_revenue_pct'),
          web3.utils.fromAscii('data:query_price'),
          web3.utils.fromAscii('data:withdraw_delay'),
        ],
        [
          '500000000000000000000',
          '2',
          '500000000000000000',
          '1000000000000000',
          '259200',
        ],
      );
      await commToken.addCapper(tcdFactory.address);

      const sportTCDTx = await tcdFactory.createTCD(
        web3.utils.fromAscii('data:'),
        sportTx.receipt.logs[2].args.bondingCurve,
        registry.address,
        sportTx.receipt.logs[2].args.params,
      );

      const sportTCD = await TCD.at(sportTCDTx.receipt.logs[0].args.tcd);
      console.log('Created Sport TCD at', sportTCD.address);
      console.error('DataSourceBookkeepingSportAddress:', sportTCD.address);
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

      // Add register
      await commToken.approve(sportTCD.address, '1000000000000000000000000');

      await Promise.all(
        dataProviders.map(async dataSource =>
          sportTCD.register('500000000000000000000', dataSource),
        ),
      );
    })
    .catch(console.log);
};
