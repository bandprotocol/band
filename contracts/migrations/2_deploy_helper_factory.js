const BondingCurveFactory = artifacts.require('BondingCurveFactory');
const CommunityTokenFactory = artifacts.require('CommunityTokenFactory');
const ParametersFactory = artifacts.require('ParametersFactory');
const MedianAggregator = artifacts.require('MedianAggregator');
const MajorityAggregator = artifacts.require('MajorityAggregator');
const Equation = artifacts.require('Equation');
const EquationExpression = artifacts.require('EquationExpression');

module.exports = function(deployer) {
  console.log('⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ 2');
  deployer.deploy(Equation);
  deployer.link(Equation, EquationExpression);
  deployer.deploy(BondingCurveFactory);
  deployer.deploy(CommunityTokenFactory);
  deployer.deploy(ParametersFactory);
  deployer.deploy(MedianAggregator);
  deployer.deploy(MajorityAggregator);
};
