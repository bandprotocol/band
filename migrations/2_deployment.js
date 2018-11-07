const BandToken = artifacts.require('./BandToken.sol');
const BondingCurve = artifacts.require('./BondingCurve.sol');
const CommunityToken = artifacts.require('./CommunityToken.sol');
const ParameterContract = artifacts.require('./Parameters.sol');
const AdminTCRContract = artifacts.require('./AdminTCR.sol');


module.exports = function (deployer) {
  // deployer.deploy(EquationLib);

  // deployer.link(EquationLib, EquationMock);
  // deployer.deploy(EquationMock);

  // deployer.then(() => {
  //   return VotingContract.new("0x32b7259893f8a4A123A83B10992b1Ff1C6D11b80");
  // }).then((voting) => {
  //   console.log('Voting:', voting.address);
  //   return ParameterContract.new(
  //     voting.address,
  //     [
  //       "params:proposal_expiration_time",
  //       "params:proposal_pass_percentage",
  //       "tcrparammin_deposit",
  //       "tcrparamapply_stage_length",
  //       "tcrparamyes_threshold",
  //       "tcrparamno_threshold",
  //       "tcrparamcommit_time",
  //       "tcrparamreveal_time",
  //       "tcrparamreward_percentage"
  //     ],
  //     [3600, 10, 100, 60, 30, 70, 360, 360, 50],
  //   );
  // }).then((params) => {
  //   console.log('Params', params.address);
  // })

  // deployer.deploy(VotingContract,
  //   "0x32b7259893f8a4A123A83B10992b1Ff1C6D11b80").then(() => {
  //     console.log("My vote", VotingContract.address);
  //     return deployer.deploy(
  //       ParameterContract,
  //       VotingContract.address,
  //       [
  //         "params:proposal_expiration_time",
  //         "params:proposal_pass_percentage",
  //         "tcrparammin_deposit",
  //         "tcrparamapply_stage_length",
  //         "tcrparamyes_threshold",
  //         "tcrparamno_threshold",
  //         "tcrparamcommit_time",
  //         "tcrparamreveal_time",
  //         "tcrparamreward_percentage"
  //       ],
  //       [3600, 10, 100, 60, 30, 70, 360, 360, 50],
  //     ).then(() => {
  //       console.log("My param", ParameterContract.address);
  //       return deployer.deploy(
  //         TCRContract,
  //         "tcrparam",
  //         "0x32b7259893f8a4A123A83B10992b1Ff1C6D11b80",
  //         VotingContract.address,
  //         ParameterContract.address,
  //       )
  //     });
  //   })

  // const communityAddress = "0x32b7259893f8a4A123A83B10992b1Ff1C6D11b80";
  // // deploy voting contract
  // deployer.deploy(VotingContract, communityAddress);

  // // deploy parameter contract
  // deployer.deploy(ParameterContract,
  //   VotingContract.address,
  //   [ "params:proposal_expiration_time",
  //     "params:proposal_pass_percentage",
  //     "tcrparammin_deposit",
  //     "tcrparamapply_stage_length",
  //     "tcrparamyes_threshold",
  //     "tcrparamno_threshold",
  //     "tcrparamcommit_time",
  //     "tcrparamreveal_time",
  //     "tcrparamreward_percentage"],
  //     [3600, 10, 100, 60, 30, 70, 360, 360, 50] );

};
