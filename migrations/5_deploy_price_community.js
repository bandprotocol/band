const BandRegistry = artifacts.require('BandRegistry');
const BandToken = artifacts.require('BandToken');
const CommunityCore = artifacts.require('CommunityCore');
const TCD = artifacts.require('TCD');
const BondingCurve = artifacts.require('BondingCurve');
const CommunityToken = artifacts.require('CommunityToken');
const BondingCurveExpression = artifacts.require('BondingCurveExpression');

module.exports = function(deployer, network, accounts) {
  deployer
    .then(async () => {
      const registry = await BandRegistry.deployed();
      const band = await BandToken.at(await registry.band());
      const dataProviders = [
        '0x98A99CBc7060584c8fd4b9B9b28A3815B617387A',
        '0x374e51e6B23b47A407F0F03A404840BE42273555',
        '0x8571121fe7D347fD6CD41b02849177C927292d45',
        '0x81D21f40595B81792025e028F397bd44ff33bcF0',
        '0xCDc294B99c6439875db639E2db46e34acdA70517',
      ];
      // Create Price community
      const priceTx = await registry.createCommunity(
        'PriceFeedCommunity',
        'PFC',
        BondingCurveExpression.address,
        '0',
        '86400',
        '50000000000000000',
        '800000000000000000',
      );
      console.log(
        'Created PriceFeedCommunity at',
        priceTx.receipt.logs[1].args.community,
      );
      const priceFeedCommunity = await CommunityCore.at(
        priceTx.receipt.logs[1].args.community,
      );

      const priceTCDTx = await priceFeedCommunity.createTCD(
        web3.utils.fromAscii('data:'),
        '500000000000000000000',
        '5',
        '500000000000000000',
        '1000000000000000',
        '259200',
      );

      const priceTCD = await TCD.at(priceTCDTx.receipt.logs[0].args.tcd);
      console.log('Created Price TCD at', priceTCD.address);
      // Buy tokens
      const curve = await BondingCurve.at(
        await priceFeedCommunity.bondingCurve(),
      );

      await band.approve(curve.address, '620000000000000148973918');
      await curve.buy(
        accounts[0],
        '620000000000000148973918',
        '1000000000000000000000000',
      );

      // Add register
      const token = await CommunityToken.at(await priceFeedCommunity.token());
      await token.approve(priceTCD.address, '1000000000000000000000000');

      await Promise.all(
        dataProviders.map(async dataSource =>
          priceTCD.register('500000000000000000000', dataSource),
        ),
      );
    })
    .catch(console.log);
};
