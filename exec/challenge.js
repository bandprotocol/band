const BandToken = artifacts.require('BandToken');
const BandRegistry = artifacts.require('BandRegistry');
const BondingCurve = artifacts.require('BondingCurve');
const CommunityCore = artifacts.require('CommunityCore');
const CommunityToken = artifacts.require('CommunityToken');
const BondingCurveExpression = artifacts.require('BondingCurveExpression');
const TCRMinDepositExpression = artifacts.require('TCRMinDepositExpression');
const CommunityFactory = artifacts.require('CommunityFactory');
const QueryTCR = artifacts.require('QueryTCR');

module.exports = function() {
  BandToken.deployed()
    .then(async band => {
      const accounts = await web3.eth.getAccounts();
      console.log(band.address);
      const registry = await BandRegistry.deployed();
      const comFactory = await CommunityFactory.at(registry.address);
      const data = await comFactory.create(
        'TestCommunity',
        'TC',
        BondingCurveExpression.address,
        '0',
        '300',
        '10000000000000000',
        '800000000000000000',
      );
      console.log(data.receipt.logs[1]);
      const TC = await CommunityCore.at(data.receipt.logs[1].args.community);
      console.log(TC.address);

      // const TC = await CommunityCore.at(
      //   '0x662511FeAD5e5949C78110f77b8B5AC376717d59',
      // );
      const bondingCurve = await BondingCurve.at(await TC.bondingCurve());
      console.log(bondingCurve.address);
      await band.approve(bondingCurve.address, '50000000000000000000000000');
      console.log(await band.allowance(accounts[0], bondingCurve.address));
      await bondingCurve.buy(
        accounts[0],
        '50000000000000000000000000',
        '40000000000000000000000',
      );
      console.log('Buy Complete!');
      const TCToken = await CommunityToken.at(await TC.token());
      await TCToken.transfer(accounts[1], '10000000000000000000000', {
        from: accounts[0],
      });
      await TCToken.transfer(accounts[2], '10000000000000000000000', {
        from: accounts[0],
      });
      await TCToken.transfer(accounts[3], '10000000000000000000000', {
        from: accounts[0],
      });

      // Create QueryTCR
      const dataTCR = await TC.createTCR(
        web3.utils.fromAscii('test:'),
        TCRMinDepositExpression.address,
        '1000000000000000000000',
        '300',
        '500000000000000000',
        '300',
        '300',
        '100000000000000000',
        '500000000000000000',
      );
      const lastEvent = dataTCR.receipt.logs.length;
      const tcr = await QueryTCR.at(dataTCR.receipt.logs[lastEvent - 1].args.tcr);
      // const tcr = await QueryTCR.at('0x8B6dA7EF0cDCABC49EFD6DFb5A64C0B1E8717E8C');
      const dataHash = web3.utils.soliditySha3('some entry');
      await TCToken.approve(tcr.address, '1100000000000000000000', {
        from: accounts[1],
      });
      await tcr.applyEntry(accounts[1], '1100000000000000000000', dataHash, {
        from: accounts[1],
      });
      const reasonHash = web3.utils.soliditySha3('some reason');
      await TCToken.approve(tcr.address, '1000000000000000000000', {
        from: accounts[2],
      });
      await tcr.initiateChallenge(
        accounts[2],
        '1000000000000000000000',
        dataHash,
        reasonHash,
        {
          from: accounts[2],
        },
      );
      await tcr.commitVote(1, web3.utils.soliditySha3(true, 21), {
        from: accounts[0],
      });
    })
    .catch(console.log);
};
