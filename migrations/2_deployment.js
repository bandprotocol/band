const CommunityToken = artifacts.require('./CommunityToken.sol');
const EquationLib = artifacts.require('./Equation.sol');
const EquationMock = artifacts.require('./EquationMock.sol');


module.exports = function (deployer) {
  deployer.deploy(EquationLib);

  deployer.link(EquationLib, EquationMock);
  deployer.deploy(EquationMock);
};
