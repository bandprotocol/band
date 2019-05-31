const Equation = artifacts.require('Equation');
const BondingCurveFactory = artifacts.require('BondingCurveFactory');
const CommunityTokenFactory = artifacts.require('CommunityTokenFactory');
const ParametersFactory = artifacts.require('ParametersFactory');
const TCDFactory = artifacts.require('TCDFactory');
const TCRFactory = artifacts.require('TCRFactory');
const BondingCurveExpression = artifacts.require('BondingCurveExpression');
const TCRMinDepositExpression = artifacts.require('TCRMinDepositExpression');

module.exports = function(deployer) {
  console.log('⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ 2');
  deployer.deploy(Equation);
  deployer.link(Equation, BondingCurveExpression);
  deployer.link(Equation, TCRMinDepositExpression);
  deployer.deploy(BondingCurveExpression, [
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
  ]);

  //  if x <= 604800
  //    return 100e16 - (90e16 * x) / 604800
  //  else
  //    return 10e16
  deployer.deploy(TCRMinDepositExpression, [
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
  ]);
  deployer.deploy(BondingCurveFactory);
  deployer.deploy(CommunityTokenFactory);
  deployer.deploy(ParametersFactory);
  deployer.deploy(TCDFactory);
  deployer.deploy(TCRFactory);
};
