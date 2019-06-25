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
const MockDataSource = artifacts.require('MockDataSource');

module.exports = function(deployer, network, accounts) {
  console.log('⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ 7');
  deployer
    .then(async () => {
      const registry = await BandRegistry.deployed();
      const commFactory = await CommunityFactory.deployed();
      const band = await BandToken.at(await registry.band());
      let dataProviders;

      if (network === 'development') {
        dataProviders = [];
        for (let i = 0; i < 2; i++) {
          const source = await deployer.deploy(
            MockDataSource,
            'sport_data_source' + (i + 1),
          );
          dataProviders.push(await source.address);
          console.log(await source.address);
          console.log(await source.owner());
        }
      } else {
        dataProviders = [
          '0x2F17B485FA21779F3aAEb1C32E2EC4Dc1A3c366F',
          '0xF2c23e8A18715a06b792c1191c3b6DdBE26fE6c3',
        ];
      }

      // Create Sport community
      const sportTx = await commFactory.create(
        'SportFeedCommunity',
        'SFC',
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

      const tcdFactory = await MultiSigTCDFactory.deployed();
      const commToken = await CommunityToken.at(
        sportTx.receipt.logs[2].args.token,
      );
      const params = await Parameters.at(sportTx.receipt.logs[2].args.params);
      await params.setRaw(
        [
          web3.utils.fromAscii('nba:min_provider_stake'),
          web3.utils.fromAscii('nba:max_provider_count'),
          web3.utils.fromAscii('nba:owner_revenue_pct'),
          web3.utils.fromAscii('nba:query_price'),
          web3.utils.fromAscii('nba:withdraw_delay'),
          web3.utils.fromAscii('nba:data_aggregator'),
        ],
        [
          '500000000000000000000',
          '2',
          '500000000000000000',
          '1000000000000000',
          '60',
          MajorityAggregator.address,
        ],
      );

      await params.setRaw(
        [
          web3.utils.fromAscii('epl:min_provider_stake'),
          web3.utils.fromAscii('epl:max_provider_count'),
          web3.utils.fromAscii('epl:owner_revenue_pct'),
          web3.utils.fromAscii('epl:query_price'),
          web3.utils.fromAscii('epl:withdraw_delay'),
          web3.utils.fromAscii('epl:data_aggregator'),
        ],
        [
          '500000000000000000000',
          '2',
          '500000000000000000',
          '1000000000000000',
          '60',
          MajorityAggregator.address,
        ],
      );

      await commToken.addCapper(tcdFactory.address);

      const nbaTCDTx = await tcdFactory.createMultiSigTCD(
        web3.utils.fromAscii('nba:'),
        sportTx.receipt.logs[2].args.bondingCurve,
        registry.address,
        sportTx.receipt.logs[2].args.params,
      );

      const eplTCDTx = await tcdFactory.createMultiSigTCD(
        web3.utils.fromAscii('epl:'),
        sportTx.receipt.logs[2].args.bondingCurve,
        registry.address,
        sportTx.receipt.logs[2].args.params,
      );

      const nbaTCD = await TCDBase.at(nbaTCDTx.receipt.logs[0].args.mtcd);
      const eplTCD = await TCDBase.at(eplTCDTx.receipt.logs[0].args.mtcd);
      console.log('Created NBA TCD at', nbaTCD.address);
      // console.error('DataSourceBookkeepingSportAddress:', nbaTCD.address);
      console.log('Created EPL TCD at', eplTCD.address);
      // console.error('DataSourceBookkeepingSportAddress:', nbaTCD.address);
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
      await commToken.approve(nbaTCD.address, '1000000000000000000000000');
      await commToken.approve(eplTCD.address, '1000000000000000000000000');

      const address0 = '0x0000000000000000000000000000000000000000';
      await Promise.all(
        dataProviders.map(async dataSource => {
          nbaTCD.register(dataSource, address0, '500000000000000000000');
          eplTCD.register(dataSource, address0, '500000000000000000000');
        }),
      );
    })
    .catch(console.log);
};
