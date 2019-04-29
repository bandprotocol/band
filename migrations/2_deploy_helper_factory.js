const Equation = artifacts.require('Equation');
const BondingCurveFactory = artifacts.require('BondingCurveFactory');
const CommunityTokenFactory = artifacts.require('CommunityTokenFactory');
const ParametersFactory = artifacts.require('ParametersFactory');
const TCDFactory = artifacts.require('TCDFactory');
const TCRFactory = artifacts.require('TCRFactory');

module.exports = function (deployer) {
  deployer.deploy(Equation);
  deployer.link(Equation, BondingCurveFactory);
  deployer.link(Equation, TCRFactory);
  deployer.deploy(BondingCurveFactory);
  deployer.deploy(CommunityTokenFactory);
  deployer.deploy(ParametersFactory);
  deployer.deploy(TCDFactory);
  deployer.deploy(TCRFactory);
};
