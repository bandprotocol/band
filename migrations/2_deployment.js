const AdminTCR = artifacts.require('./AdminTCR.sol');
const BandToken = artifacts.require('./BandToken.sol');
const CommunityCore = artifacts.require('./CommunityCore.sol');
const CommunityToken = artifacts.require('./CommunityToken.sol');
const Parameters = artifacts.require('./Parameters.sol');
const TCR = artifacts.require('./TCR.sol');


module.exports = function (deployer) {
  deployer.deploy(
    BandToken,
    1000000000,
  ).then(() => {
    return deployer.deploy(
      CommunityToken,
      "CoinHatcher",
      "HAT",
      18,
    ).then(() => {
      return deployer.deploy(
        Parameters,
        CommunityToken.address,
        [
          "params:proposal_expiration_time",
          "params:proposal_pass_percentage",
          "tcrparammin_deposit",
          "tcrparamapply_stage_length",
          "tcrparamyes_threshold",
          "tcrparamno_threshold",
          "tcrparamcommit_time",
          "tcrparamreveal_time",
          "tcrparamreward_percentage"
        ],
        [3600, 10, 100, 60, 30, 70, 360, 360, 50],
      ).then(() => {
        return deployer.deploy(
          AdminTCR,
          Parameters.address,
        ).then(() => {
          return deployer.deploy(
            CommunityCore,
            AdminTCR.address,
            BandToken.address,
            Parameters.address,
            [8, 1, 0, 2],
          );
        });
      });
    });
  });
};
