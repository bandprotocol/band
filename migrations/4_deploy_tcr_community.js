const BandRegistry = artifacts.require('BandRegistry');
const CommunityCore = artifacts.require('CommunityCore');

module.exports = function (deployer) {
  deployer.then(async () => {
    const registry = await BandRegistry.deployed();
    const data = await registry.createCommunity(
      'CoinHatcher',
      'CHT',
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
    const coinHatcher = await CommunityCore.at(
      data.receipt.logs[0].args.community,
    );
    await coinHatcher.createTCR(
      web3.utils.fromAscii('tcr:'),
      //  if x <= 604800
      //    return 100e16 - (90e16 * x) / 604800
      //  else
      //    return 10e16
      [
        18,
        14,
        1,
        0,
        604800,
        5,
        0,
        '1000000000000000000',
        7,
        6,
        0,
        '900000000000000000',
        1,
        0,
        604800,
        0,
        '100000000000000000',
      ],
      '100000000000000000000',
      '21600',
      '500000000000000000',
      '43200',
      '3600',
      '100000000000000000',
      '500000000000000000',
    );
  }).catch(console.log);
};
