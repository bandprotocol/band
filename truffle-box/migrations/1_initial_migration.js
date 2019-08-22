const Migrations = artifacts.require("Migrations");
const GasStation = artifacts.require("GasStation");
const GroceryStore = artifacts.require("GroceryStore");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(GasStation);
  deployer.deploy(GroceryStore);
};
