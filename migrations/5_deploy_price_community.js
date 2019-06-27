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

module.exports = function(deployer, network, accounts) {
  console.log('⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ 5');
  if (!process.env.DEPLOY_PRICE) return;
  deployer
    .then(async () => {
      const registry = await BandRegistry.deployed();
      const commFactory = await CommunityFactory.deployed();
      const band = await BandToken.at(await registry.band());

      const dataProviders = {
        COINBASE: '0xda7af0fd57c5d2e918704f034fd9e13aeb28ad13',
        BITSTAMP: '0xda7a01d6d7568868b21a6789968b06bb3af5c191',
        BITFINEX: '0xda7a2a9c0bb0f94f9ddf54dde3dbe2530a8269a2',
        GEMINI: '0xda7a2e3d741f025010c44afa2a6a7353f70d6b23',
        KRAKEN: '0xda7a6811d4dd6a6b0f0ef1f1fe2f99ecd0ce9b7a',
        BITTREX: '0xda7a90b4b2078e0446974014c319157ab02c24b7',
        CMC: '0xda7af2d3f2321e815cf3841bd0d9a889de22e37c',
        CRYPTOCOMPARE: '0xda7a814e8b96417274466e2492298b039a854a8c',
        OPENMARKETCAP: '0xda7a6db349b7ae544234f91abd01dd825b8969cd',
        ONCHAINFX: '0xda7adb240fb99dcd55e19a17b97ac2163d4d4509',
        BANCOR: '0xda7a3c7309bd2de2e89a554191b2d7c71125186c',
        KYBER: '0xda7aeec22311453193c55af63ef7f2df4e6a73d2',
        UNISWAP: '0xda7a7f095be77012679df0744d8a163823c0558e',
        FREE_FOREX: '0xda7aa2bba8685f9c0ddbc53ab8e19a6a32dc8b7f',
        ALPHAVANTAGE: '0xda7a79196ddd8ad788a996efafea15bf0879c31c',
        CURRENCY_CONVERTER_API: '0xda7af1118c2c5f2edb0d452a84be91e7b47014cb',
        API_RATESAPI_IO: '0xda7a238d208eda262505d43678b7d7f180a9ee69',
        FINANCIAL_MODELING_PREP: '0xda7ae92ef9089f9093e9555b6cf2fd3e29e3d6d7',
        WORLD_TRADING_DATA: '0xda7aa81514ae2108da300639d46aa399abaefa05',
      };

      const tcds = [
        {
          prefix: 'crypto:',
          providers: [
            'COINBASE',
            'BITSTAMP',
            'BITFINEX',
            'GEMINI',
            'KRAKEN',
            'BITTREX',
            'CMC',
            'CRYPTOCOMPARE',
            'OPENMARKETCAP',
            'ONCHAINFX',
          ],
        },
        {
          prefix: 'erc20:',
          providers: [
            'BANCOR',
            'KYBER',
            'UNISWAP',
            'CMC',
            'CRYPTOCOMPARE',
            'OPENMARKETCAP',
            'ONCHAINFX',
          ],
        },
        {
          prefix: 'fx:',
          providers: [
            'FREE_FOREX',
            'ALPHAVANTAGE',
            'CURRENCY_CONVERTER_API',
            'API_RATESAPI_IO',
          ],
        },
        {
          prefix: 'useq:',
          providers: [
            'ALPHAVANTAGE',
            'FINANCIAL_MODELING_PREP',
            'WORLD_TRADING_DATA',
          ],
        },
      ];

      const tcdList = [];

      // Create Price community
      const priceTx = await commFactory.create(
        'Financial Data Feeds',
        'XFN',
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

      const address0 = '0x0000000000000000000000000000000000000000';

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
            MedianAggregator.address,
          ],
        );
        const tcdtx = await tcdFactory.createMultiSigTCD(
          web3.utils.fromAscii(tcdDetail.prefix),
          priceTx.receipt.logs[2].args.bondingCurve,
          registry.address,
          priceTx.receipt.logs[2].args.params,
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
        'DataSourceBookkeepingPriceAddress:',
        JSON.stringify(tcdList),
      );
    })
    .catch(console.log);
};
