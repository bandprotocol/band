const BandRegistry = artifacts.require('BandRegistry');
const BandToken = artifacts.require('BandToken');
const TCDBase = artifacts.require('TCDBase');
const MultiSigTCDFactory = artifacts.require('MultiSigTCDFactory');
const BondingCurve = artifacts.require('BondingCurve');
const CommunityToken = artifacts.require('CommunityToken');
const BondingCurveExpression = artifacts.require('BondingCurveExpression');
const CommunityFactory = artifacts.require('CommunityFactory');
const Parameters = artifacts.require('Parameters');
const MedianAggregator = artifacts.require('MedianAggregator');
const MockDataSource = artifacts.require('MockDataSource');

module.exports = function(deployer, network, accounts) {
  console.log('⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ 5');
  deployer
    .then(async () => {
      const registry = await BandRegistry.deployed();
      const commFactory = await CommunityFactory.deployed();
      const band = await BandToken.at(await registry.band());

      const dataProviders = [
        '0xc169830Cd17Fd32C3885B1D8Bc9f1D41E3dB302c',
        '0x53193a6A161F23be0AD9bB549D4d2725164fdF88',
        '0xb146bD7B958B8928651cf4c28953F425B33F31c5',
        '0xf1e5c7513B6563f555A3410C13E1f3D28640A38E',
        '0x99a1D406baE20D2BFb2Cf0177E41E6Ed0B54AFee',
      ];

      const tcdList = [];

      // Create Price community
      const priceTx = await commFactory.create(
        'Price Dataset',
        'PRC',
        BondingCurveExpression.address,
        '0',
        '86400',
        '50000000000000000',
        '800000000000000000',
      );
      console.log('Created PriceDataset [bondingCurve,params,token] at', [
        priceTx.receipt.logs[2].args.bondingCurve,
        priceTx.receipt.logs[2].args.params,
        priceTx.receipt.logs[2].args.token,
      ]);
      const tcdFactory = await MultiSigTCDFactory.deployed();
      const commToken = await CommunityToken.at(
        priceTx.receipt.logs[2].args.token,
      );
      const params = await Parameters.at(priceTx.receipt.logs[2].args.params);

      await commToken.addCapper(tcdFactory.address);
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

      // Crypto price
      await params.setRaw(
        [
          web3.utils.fromAscii('crypto:min_provider_stake'),
          web3.utils.fromAscii('crypto:max_provider_count'),
          web3.utils.fromAscii('crypto:owner_revenue_pct'),
          web3.utils.fromAscii('crypto:query_price'),
          web3.utils.fromAscii('crypto:withdraw_delay'),
          web3.utils.fromAscii('crypto:data_aggregator'),
        ],
        [
          '500000000000000000000',
          '5',
          '500000000000000000',
          '1000000000000000',
          '259200',
          MedianAggregator.address,
        ],
      );
      const cyptoTCDTx = await tcdFactory.createMultiSigTCD(
        web3.utils.fromAscii('crypto:'),
        priceTx.receipt.logs[2].args.bondingCurve,
        registry.address,
        priceTx.receipt.logs[2].args.params,
      );
      const cryptoTCD = await TCDBase.at(cyptoTCDTx.receipt.logs[0].args.mtcd);
      console.log('Created CryptoPrice TCD at', cryptoTCD.address);
      tcdList.push(cryptoTCD.address);

      const address0 = '0x0000000000000000000000000000000000000000';
      await Promise.all(
        dataProviders.map(async dataSource => {
          cryptoTCD.register(dataSource, address0, '500000000000000000000');
        }),
      );

      // Fiat price
      await params.setRaw(
        [
          web3.utils.fromAscii('fiat:min_provider_stake'),
          web3.utils.fromAscii('fiat:max_provider_count'),
          web3.utils.fromAscii('fiat:owner_revenue_pct'),
          web3.utils.fromAscii('fiat:query_price'),
          web3.utils.fromAscii('fiat:withdraw_delay'),
          web3.utils.fromAscii('fiat:data_aggregator'),
        ],
        [
          '500000000000000000000',
          '4',
          '500000000000000000',
          '1000000000000000',
          '259200',
          MedianAggregator.address,
        ],
      );
      const fiatTCDTx = await tcdFactory.createMultiSigTCD(
        web3.utils.fromAscii('fiat:'),
        priceTx.receipt.logs[2].args.bondingCurve,
        registry.address,
        priceTx.receipt.logs[2].args.params,
      );
      const fiatTCD = await TCDBase.at(fiatTCDTx.receipt.logs[0].args.mtcd);
      console.log('Created FiatPrice TCD at', fiatTCD.address);
      tcdList.push(fiatTCD.address);

      await Promise.all(
        dataProviders.map(async dataSource => {
          fiatTCD.register(dataSource, address0, '500000000000000000000');
        }),
      );

      // Commodity price
      await params.setRaw(
        [
          web3.utils.fromAscii('commod:min_provider_stake'),
          web3.utils.fromAscii('commod:max_provider_count'),
          web3.utils.fromAscii('commod:owner_revenue_pct'),
          web3.utils.fromAscii('commod:query_price'),
          web3.utils.fromAscii('commod:withdraw_delay'),
          web3.utils.fromAscii('commod:data_aggregator'),
        ],
        [
          '500000000000000000000',
          '3',
          '500000000000000000',
          '1000000000000000',
          '259200',
          MedianAggregator.address,
        ],
      );
      const commodTCDTx = await tcdFactory.createMultiSigTCD(
        web3.utils.fromAscii('commod:'),
        priceTx.receipt.logs[2].args.bondingCurve,
        registry.address,
        priceTx.receipt.logs[2].args.params,
      );
      const commodTCD = await TCDBase.at(commodTCDTx.receipt.logs[0].args.mtcd);
      console.log('Created CommodPrice TCD at', commodTCD.address);
      tcdList.push(commodTCD.address);

      await Promise.all(
        dataProviders.map(async dataSource => {
          commodTCD.register(dataSource, address0, '500000000000000000000');
        }),
      );

      // Stock price
      await params.setRaw(
        [
          web3.utils.fromAscii('stock:min_provider_stake'),
          web3.utils.fromAscii('stock:max_provider_count'),
          web3.utils.fromAscii('stock:owner_revenue_pct'),
          web3.utils.fromAscii('stock:query_price'),
          web3.utils.fromAscii('stock:withdraw_delay'),
          web3.utils.fromAscii('stock:data_aggregator'),
        ],
        [
          '500000000000000000000',
          '3',
          '500000000000000000',
          '1000000000000000',
          '259200',
          MedianAggregator.address,
        ],
      );
      const stockTCDTx = await tcdFactory.createMultiSigTCD(
        web3.utils.fromAscii('stock:'),
        priceTx.receipt.logs[2].args.bondingCurve,
        registry.address,
        priceTx.receipt.logs[2].args.params,
      );
      const stockTCD = await TCDBase.at(stockTCDTx.receipt.logs[0].args.mtcd);
      console.log('Created StockPrice TCD at', stockTCD.address);
      tcdList.push(stockTCD.address);

      await Promise.all(
        dataProviders.map(async dataSource => {
          stockTCD.register(dataSource, address0, '500000000000000000000');
        }),
      );

      console.error(
        'DataSourceBookkeepingPriceAddress:',
        JSON.stringify(tcdList),
      );
    })
    .catch(console.log);
};
