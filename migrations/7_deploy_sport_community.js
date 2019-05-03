const BandRegistry = artifacts.require('BandRegistry');
const BandToken = artifacts.require('BandToken');
const CommunityCore = artifacts.require('CommunityCore');
const TCD = artifacts.require('TCD');
const BondingCurve = artifacts.require('BondingCurve');
const CommunityToken = artifacts.require('CommunityToken');

module.exports = function(deployer, network, accounts) {
  deployer
    .then(async () => {
      const registry = await BandRegistry.deployed();
      const band = await BandToken.at(await registry.band());
      const dataProviders = [
        '0x2F17B485FA21779F3aAEb1C32E2EC4Dc1A3c366F',
        '0xF2c23e8A18715a06b792c1191c3b6DdBE26fE6c3',
      ];
      // Create Sport community
      const sportTx = await registry.createCommunity(
        'SportFeedCommunity',
        'SFC',
        [
          '18',
          '12',
          '1',
          '0',
          '228652525963663850000000',
          '7',
          '6',
          '0',
          '12500000000000188000',
          '1',
          '0',
          '228652525963663850000000',
          '20',
          '0',
          '12500000000000188000',
          '1',
          '0',
          '228652525963663850000000',
          '0',
          '5000000',
        ],
        '0',
        '86400',
        '50000000000000000',
        '800000000000000000',
      );
      console.log(
        'Created SportFeedCommunity at',
        sportTx.receipt.logs[0].args.community,
      );
      const sportFeedCommunity = await CommunityCore.at(
        sportTx.receipt.logs[0].args.community,
      );

      const sportTCDTx = await sportFeedCommunity.createTCD(
        '500000000000000000000',
        '2',
        '500000000000000000',
        '1000000000000000',
        '259200',
      );

      const sportTCD = await TCD.at(sportTCDTx.receipt.logs[0].args.tcd);
      console.log('Created Sport TCD at', sportTCD.address);
      // Buy tokens
      const curve = await BondingCurve.at(
        await sportFeedCommunity.bondingCurve(),
      );
      await band.approve(curve.address, '620000000000000148973918');
      await curve.buy(
        accounts[0],
        '620000000000000148973918',
        '1000000000000000000000000',
      );

      // Add register
      const token = await CommunityToken.at(await sportFeedCommunity.token());
      await token.approve(sportTCD.address, '1000000000000000000000000');

      await Promise.all(
        dataProviders.map(async dataSource =>
          sportTCD.register(accounts[0], '500000000000000000000', dataSource),
        ),
      );
    })
    .catch(console.log);
};
