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
        '0x1e84754D96E5caAB92c9b2Ac3b6EC2BB6a109FF6',
        '0xB91BA347625F6dE60Be8A6729a5AB05f30AC3dca',
        '0xb21bA08F615BAE1C5d39fE5426c7eB191235188C',
      ];
      // Create Lottery community
      const lotteryTx = await registry.createCommunity(
        'LotteryFeedCommunity',
        'LFC',
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
        'Created LotteryFeedCommunity at',
        lotteryTx.receipt.logs[0].args.community,
      );
      const lotteryFeedCommunity = await CommunityCore.at(
        lotteryTx.receipt.logs[0].args.community,
      );

      const lotteryTCDTx = await lotteryFeedCommunity.createTCD(
        '500000000000000000000',
        '3',
        '500000000000000000',
        '1000000000000000',
        '259200',
      );

      const lotteryTCD = await TCD.at(lotteryTCDTx.receipt.logs[0].args.tcd);
      console.log('Created Lottery TCD at', lotteryTCD.address);
      // Buy tokens
      const curve = await BondingCurve.at(
        await lotteryFeedCommunity.bondingCurve(),
      );

      await band.approve(curve.address, '620000000000000148973918');
      await curve.buy(
        accounts[0],
        '620000000000000148973918',
        '1000000000000000000000000',
      );

      // Add register
      const token = await CommunityToken.at(await lotteryFeedCommunity.token());
      await token.approve(lotteryTCD.address, '1000000000000000000000000');

      await Promise.all(
        dataProviders.map(async dataSource =>
          lotteryTCD.register(accounts[0], '500000000000000000000', dataSource),
        ),
      );
    })
    .catch(console.log);
};
