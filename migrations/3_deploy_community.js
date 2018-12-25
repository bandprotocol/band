const AdminSimple = artifacts.require('./AdminSimple.sol');
const BandToken = artifacts.require('./BandToken.sol');
const CommunityCore = artifacts.require('./CommunityCore.sol');
const CommunityToken = artifacts.require('./CommunityToken.sol');
const Parameters = artifacts.require('./Parameters.sol');
const Voting = artifacts.require('./Voting.sol');

module.exports = deployer => {
  deployer
    .then(async () => {
      const communtiyToken = await deployer.deploy(
        CommunityToken,
        'CoinHatcher',
        'HAT',
        18,
      );

      await deployer.deploy(Voting, CommunityToken.address);

      await deployer.deploy(
        Parameters,
        Voting.address,
        [
          web3.utils.fromAscii('core:admin_contract'),
          web3.utils.fromAscii('core:reward_period'),
          web3.utils.fromAscii('core:reward_edit_period'),
          web3.utils.fromAscii('params:commit_time'),
          web3.utils.fromAscii('params:reveal_time'),
          web3.utils.fromAscii('params:support_required_pct'),
          web3.utils.fromAscii('params:min_participation_pct'),
          web3.utils.fromAscii('admin:min_deposit'),
          web3.utils.fromAscii('admin:apply_stage_length'),
          web3.utils.fromAscii('admin:support_required_pct'),
          web3.utils.fromAscii('admin:min_participation_pct'),
          web3.utils.fromAscii('admin:commit_time'),
          web3.utils.fromAscii('admin:reveal_time'),
          web3.utils.fromAscii('admin:reward_percentage'),
        ],
        [
          AdminSimple.address,
          '120',
          '120',
          '60',
          '60',
          '70',
          '10',
          '100',
          '60',
          '50',
          '10',
          '60',
          '60',
          '50',
        ],
      );

      const coreContract = await deployer.deploy(
        CommunityCore,
        BandToken.address,
        CommunityToken.address,
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
