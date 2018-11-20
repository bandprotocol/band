const AdminTCR = artifacts.require('./AdminTCR.sol');
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
          'params:proposal_expiration_time',
          'params:proposal_pass_percentage',
          'admin:min_deposit',
          'admin:apply_stage_length',
          'admin:yes_threshold',
          'admin:no_threshold',
          'admin:commit_time',
          'admin:reveal_time',
          'admin:reward_percentage',
        ],
        [3600, 10, 100, 60, 30, 70, 360, 360, 50],
      );

      await deployer.deploy(AdminTCR, Parameters.address);

      const coreContract = await deployer.deploy(
        CommunityCore,
        AdminTCR.address,
        BandToken.address,
        Parameters.address,
        [8, 1, 0, 2],
      );

      await communtiyToken.transferOwnership(CommunityCore.address);
      await coreContract.activate(0);
    })
    .catch(err => {
      console.log('ERROR', err);
    });
};
