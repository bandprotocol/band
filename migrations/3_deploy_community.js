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
          'core:admin_contract',
          'params:proposal_expiration_time',
          'params:support_required',
          'params:minimum_quorum',
          'admin:min_deposit',
          'admin:apply_stage_length',
          'admin:yes_threshold',
          'admin:no_threshold',
          'admin:commit_time',
          'admin:reveal_time',
          'admin:reward_percentage',
        ],
        [AdminSimple.address, 3600, 70, 10, 100, 60, 30, 70, 360, 360, 50],
      );

      const coreContract = await deployer.deploy(
        CommunityCore,
        BandToken.address,
        Parameters.address,
        [8, 7, 8, 1, 0, 2, 0, 2000000000000000000000000000000000000, 0, 2],
      );

      await communtiyToken.transferOwnership(CommunityCore.address);
      await coreContract.activate(0);
    })
    .catch(err => {
      console.log('ERROR', err);
    });
};
