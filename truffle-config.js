const HDWalletProvider = require('truffle-hdwallet-provider');

/*
 * NB: since truffle-hdwallet-provider 0.0.5 you must wrap HDWallet providers in
 * a function when declaring them. Failure to do so will cause commands to hang.
 * ex:
 * ```
 * mainnet: {
 *     provider: function() {
 *       return new HDWalletProvider(mnemonic,
 * 'https://mainnet.infura.io/<infura-key>')
 *     },
 *     network_id: '1',
 *     gas: 4500000,
 *     gasPrice: 10000000000,
 *   },
 */

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    rinkeby: {
      provider: () =>
        new HDWalletProvider(
          process.env.MNENOMIC,
          'https://rinkeby.infura.io/v3/' + process.env.INFURA_API_KEY,
        ),
      network_id: 4,
      gasPrice: 5000000000,
      gas: 6800000,
      skipDryRun: true,
    },
    development: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '*',
      gasPrice: 1000000000,
    },
  },
  compilers: {
    solc: {
      version: '0.5.8',
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        },
      },
    },
  },
};
