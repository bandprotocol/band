const BandRegistry = artifacts.require('BandRegistry');
const BandToken = artifacts.require('BandToken');
const TCDBase = artifacts.require('TCDBase');
const TCDFactory = artifacts.require('TCDFactory');
const BondingCurve = artifacts.require('BondingCurve');
const CommunityToken = artifacts.require('CommunityToken');
const BondingCurveExpression = artifacts.require('BondingCurveExpression');
const CommunityFactory = artifacts.require('CommunityFactory');
const Parameters = artifacts.require('Parameters');

module.exports = function(deployer, network, accounts) {
  console.log('⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ 5');
  deployer
    .then(async () => {
      const registry = await BandRegistry.deployed();
      const commFactory = await CommunityFactory.deployed();
      const band = await BandToken.at(await registry.band());
      const dataProviders = [
        '0x98A99CBc7060584c8fd4b9B9b28A3815B617387A',
        '0x374e51e6B23b47A407F0F03A404840BE42273555',
        '0x8571121fe7D347fD6CD41b02849177C927292d45',
        '0x81D21f40595B81792025e028F397bd44ff33bcF0',
        '0xCDc294B99c6439875db639E2db46e34acdA70517',
      ];
      // Create Price community
      const priceTx = await commFactory.create(
        'PriceFeedCommunity',
        'PFC',
        BondingCurveExpression.address,
        '0',
        '86400',
        '50000000000000000',
        '800000000000000000',
      );
      console.log('Created PriceFeedCommunity [bondingCurve,params,token] at', [
        priceTx.receipt.logs[2].args.bondingCurve,
        priceTx.receipt.logs[2].args.params,
        priceTx.receipt.logs[2].args.token,
      ]);
      const tcdFactory = await TCDFactory.deployed();
      const commToken = await CommunityToken.at(
        priceTx.receipt.logs[2].args.token,
      );
      const params = await Parameters.at(priceTx.receipt.logs[2].args.params);
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
          '5',
          '500000000000000000',
          '1000000000000000',
          '259200',
        ],
      );
      await commToken.addCapper(tcdFactory.address);

      const priceTCDTx = await tcdFactory.createTCD(
        web3.utils.fromAscii('data:'),
        priceTx.receipt.logs[2].args.bondingCurve,
        registry.address,
        priceTx.receipt.logs[2].args.params,
        true,
      );
      const priceTCD = await TCDBase.at(priceTCDTx.receipt.logs[0].args.tcd);
      console.log('Created Price TCD at', priceTCD.address);
      console.error('DataSourceBookkeepingPriceAddress:', priceTCD.address);
      // Buy tokens
      const curve = await BondingCurve.at(
        priceTx.receipt.logs[2].args.bondingCurve,
      );

      await band.approve(curve.address, '620000000000000148973918');
      await curve.buy(
        accounts[0],
        '620000000000000148973918',
        '1000000000000000000000000',
      );

      // Add register
      await commToken.approve(priceTCD.address, '1000000000000000000000000');

      await Promise.all(
        dataProviders.map(async dataSource => {
          priceTCD.register('500000000000000000000', dataSource);
        }),
      );
    })
    .catch(console.log);
};
