const Counter = artifacts.require('./Counter.sol');
const LibEquation = artifacts.require('./Equation.sol');
const Eq = artifacts.require('./EquationMock.sol');

module.exports = function (deployer) {
  deployer.deploy(Counter);
  deployer.deploy(LibEquation);
  deployer.link(LibEquation, Eq);
  deployer.deploy(Eq);
};
