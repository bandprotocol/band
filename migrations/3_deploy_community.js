const AdminSimple = artifacts.require('./AdminSimple.sol');
const BandToken = artifacts.require('./BandToken.sol');
const CommunityCore = artifacts.require('./CommunityCore.sol');
const CommunityToken = artifacts.require('./CommunityToken.sol');
const Parameters = artifacts.require('./Parameters.sol');

module.exports = deployer => {
  deployer
    .then(async () => {
      const communtiyToken = await deployer.deploy(
        CommunityToken,
        'CoinHatcher',
        'HAT',
        18,
      );

      await deployer.deploy(
        Parameters,
        CommunityToken.address,
        [
          web3.utils.fromAscii('core:admin_contract'),
          web3.utils.fromAscii('params:proposal_expiration_time'),
          web3.utils.fromAscii('params:support_required'),
          web3.utils.fromAscii('params:minimum_quorum'),
          web3.utils.fromAscii('admin:min_deposit'),
          web3.utils.fromAscii('admin:apply_stage_length'),
          web3.utils.fromAscii('admin:yes_threshold'),
          web3.utils.fromAscii('admin:no_threshold'),
          web3.utils.fromAscii('admin:commit_time'),
          web3.utils.fromAscii('admin:reveal_time'),
          web3.utils.fromAscii('admin:reward_percentage'),
        ],
        [
          AdminSimple.address,
          '120',
          '70',
          '10',
          '100',
          '60',
          '30',
          '70',
          '360',
          '360',
          '50',
        ],
      );

      const coreContract = await deployer.deploy(
        CommunityCore,
        BandToken.address,
        Parameters.address,
        [
          '8',
          '7',
          '8',
          '1',
          '0',
          '2',
          '0',
          '2000000000000000000000000000000000000',
          '0',
          '2',
        ],
      );

      await communtiyToken.transferOwnership(CommunityCore.address);
      await coreContract.activate('0');
    })
    .catch(err => {
      console.log('ERROR', err);
    });
};
