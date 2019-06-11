const BandToken = artifacts.require('BandToken');
const BondingCurve = artifacts.require('BondingCurve');
const CommunityToken = artifacts.require('CommunityToken');
const QueryTCR = artifacts.require('QueryTCR');

module.exports = function() {
  BandToken.deployed()
    .then(async band => {
      const accounts = await web3.eth.getAccounts();
      console.log(band.address);

      // const TC = await CommunityCore.at(
      //   '0x662511FeAD5e5949C78110f77b8B5AC376717d59',
      // );
      const bondingCurve = await BondingCurve.at(
        '0xfFaC7CA3856e1F03beB4f8106aE201DfAE959242',
      );
      console.log(bondingCurve.address);
      await band.approve(bondingCurve.address, '50000000000000000000000000');
      console.log(await band.allowance(accounts[0], bondingCurve.address));
      await bondingCurve.buy(
        accounts[0],
        '50000000000000000000000000',
        '40000000000000000000000',
      );
      console.log('Buy Complete!');
      const TCToken = await CommunityToken.at(
        '0x46B50025B9ddB374FD55dD77F8FAd837e10DED4f',
      );
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
      const tcr = await QueryTCR.at(
        '0xc0CB2a1eA0d434baBd8438A48Bc5C403763c909F',
      );
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
