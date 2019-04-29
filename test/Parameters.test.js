const { time } = require('openzeppelin-test-helpers');

const BandToken = artifacts.require('BandToken');
const BandRegistry = artifacts.require('BandRegistry');
const BondingCurve = artifacts.require('BondingCurve');
const CommunityCore = artifacts.require('CommunityCore');
const CommunityToken = artifacts.require('CommunityToken');
const Parameters = artifacts.require('Parameters');
const SimpleVoting = artifacts.require('SimpleVoting');

require('chai').should();

contract('Parameters', ([_, owner, alice, bob]) => {
  context('After successful initialization', () => {
    beforeEach(async () => {
      this.factory = await BandRegistry.deployed();
      this.band = await BandToken.at(await this.factory.band());
      await this.band.transfer(_, await this.band.balanceOf(owner), {
        from: owner,
      });
      await this.band.transfer(_, await this.band.balanceOf(alice), {
        from: alice,
      });
      await this.band.transfer(_, await this.band.balanceOf(bob), {
        from: bob,
      });
      const data = await this.factory.createCommunity(
        'CoinHatcher',
        'CHT',
        [8, 1, 0, 2],
        '0',
        '60',
        '600000000000000000',
        '800000000000000000',
      );
      this.core = await CommunityCore.at(data.receipt.logs[0].args.community);
      this.comm = await CommunityToken.at(await this.core.token());
      this.curve = await BondingCurve.at(await this.core.bondingCurve());
      this.params = await Parameters.at(await this.core.params());
      this.voting = await SimpleVoting.at(await this.factory.simpleVoting());

      await this.band.transfer(owner, 1000000, { from: _ });
      await this.band.transfer(alice, 100000, { from: owner });
      await this.band.transfer(bob, 100000, { from: owner });

      // alice buy 100 XCH
      const calldata1 = this.curve.contract.methods.buy(_, 0, 100).encodeABI();
      await this.band.transferAndCall(
        alice,
        this.curve.address,
        11000,
        '0x' + calldata1.slice(2, 10),
        '0x' + calldata1.slice(138),
        { from: alice },
      );

      // bob buy 100 XCH
      const calldata2 = this.curve.contract.methods.buy(_, 0, 100).encodeABI();
      await this.band.transferAndCall(
        bob,
        this.curve.address,
        30000,
        '0x' + calldata2.slice(2, 10),
        '0x' + calldata2.slice(138),
        { from: bob },
      );
    });

    context('Checking basic functionalities', () => {
      it('should allow getting existing parameters', async () => {
        (await this.params.get(
          web3.utils.fromAscii('params:support_required_pct'),
        ))
          .toString()
          .should.eq('800000000000000000');
      });
    });

    context('Checking parameter requirements', () => {
      it('should be Inconclusive case(participants less than minimum participation)', async () => {
        await this.params.propose(
          owner,
          '0xed468fdf3997ff072cd4fa4a58f962616c52e990e4ccd9febb59bb86b308a75d',
          [web3.utils.fromAscii('example_proposal')],
          [1000000],
          {
            from: owner,
          },
        );

        // castVote
        await this.voting.castVote(alice, this.params.address, 1, 20, 0, {
          from: alice,
        });
        await this.voting.castVote(bob, this.params.address, 1, 10, 0, {
          from: bob,
        });
        await time.increase(time.duration.seconds(60));

        // resolvePoll
        await this.voting.resolvePoll(this.params.address, 1, { from: alice });

        // assertion
        (await this.voting.polls(this.params.address, 1)).pollState
          .toString()
          .should.be.eq('4');
      });

      it('should be Yes case(participants more than minimum participation)', async () => {
        await this.params.propose(
          owner,
          '0xed468fdf3997ff072cd4fa4a58f962616c52e990e4ccd9febb59bb86b308a75d',
          [web3.utils.fromAscii('example_proposal')],
          [1000000],
          {
            from: owner,
          },
        );

        // castVote
        await this.voting.castVote(alice, this.params.address, 1, 60, 0, {
          from: alice,
        });
        await this.voting.castVote(bob, this.params.address, 1, 60, 0, {
          from: bob,
        });

        await time.increase(time.duration.seconds(60));

        // resolvePoll
        await this.voting.resolvePoll(this.params.address, 1, { from: alice });

        // assertion
        (await this.voting.polls(this.params.address, 1)).pollState
          .toString()
          .should.be.eq('2');
      });

      it('should be No case(votes Yes less than support_required_pct)', async () => {
        await this.params.propose(
          owner,
          '0xed468fdf3997ff072cd4fa4a58f962616c52e990e4ccd9febb59bb86b308a75d',
          [web3.utils.fromAscii('example_proposal')],
          [1000000],
          {
            from: owner,
          },
        );

        // castVote
        await this.voting.castVote(alice, this.params.address, 1, 10, 70, {
          from: alice,
        });
        await this.voting.castVote(bob, this.params.address, 1, 40, 20, {
          from: bob,
        });

        await time.increase(time.duration.seconds(60));

        // resolvePoll
        await this.voting.resolvePoll(this.params.address, 1, { from: alice });

        // assertion
        (await this.voting.polls(this.params.address, 1)).pollState
          .toString()
          .should.be.eq('3');
      });

      it('should change params:support_required_pct to 60', async () => {
        await this.params.propose(
          owner,
          '0xed468fdf3997ff072cd4fa4a58f962616c52e990e4ccd9febb59bb86b308a75d',
          [web3.utils.fromAscii('params:support_required_pct')],
          ['600000000000000000'],
          {
            from: owner,
          },
        );

        // castVote
        await this.voting.castVote(alice, this.params.address, 1, 100, 0, {
          from: alice,
        });
        await this.voting.castVote(bob, this.params.address, 1, 100, 0, {
          from: bob,
        });

        await time.increase(time.duration.seconds(60));

        // resolvePoll
        await this.voting.resolvePoll(this.params.address, 1, { from: alice });

        // assertion
        (await this.voting.polls(this.params.address, 1)).pollState
          .toString()
          .should.be.eq('2');

        (await this.params.get(
          web3.utils.fromAscii('params:support_required_pct'),
        ))
          .toString()
          .should.eq('600000000000000000');
      });

      it('should support feeless execution', async () => {
        const nonce = {
          alice: (await time.latest()).toNumber() * 1000,
          bob: (await time.latest()).toNumber() * 1000,
          owner: (await time.latest()).toNumber() * 1000,
        };
        let data = await this.params.contract.methods
          .propose(
            owner,
            '0xed468fdf3997ff072cd4fa4a58f962616c52e990e4ccd9febb59bb86b308a75d',
            [web3.utils.fromAscii('params:support_required_pct')],
            [60],
          )
          .encodeABI();
        let dataNoFuncSig = '0x' + data.slice(10 + 64);
        let sig = await web3.eth.sign(
          web3.utils.soliditySha3(++nonce.owner, dataNoFuncSig),
          owner,
        );
        await this.factory.sendDelegatedExecution(
          owner,
          this.params.address,
          '0x' + data.slice(2, 10),
          nonce.owner,
          dataNoFuncSig,
          sig,
          { from: alice },
        );
        // alice commit vote
        data = await this.voting.contract.methods
          .castVote(alice, this.params.address, 1, 100, 0)
          .encodeABI();
        dataNoFuncSig = '0x' + data.slice(10 + 64);
        sig = await web3.eth.sign(
          web3.utils.soliditySha3(++nonce.alice, dataNoFuncSig),
          alice,
        );
        await this.factory.sendDelegatedExecution(
          alice,
          this.voting.address,
          '0x' + data.slice(2, 10),
          nonce.alice,
          dataNoFuncSig,
          sig,
          { from: owner },
        );
        // bob commit vote
        data = await this.voting.contract.methods
          .castVote(bob, this.params.address, 1, 100, 0)
          .encodeABI();
        dataNoFuncSig = '0x' + data.slice(10 + 64);
        sig = await web3.eth.sign(
          web3.utils.soliditySha3(++nonce.bob, dataNoFuncSig),
          bob,
        );
        await this.factory.sendDelegatedExecution(
          bob,
          this.voting.address,
          '0x' + data.slice(2, 10),
          nonce.bob,
          dataNoFuncSig,
          sig,
          { from: owner },
        );

        await time.increase(time.duration.seconds(60));

        // resolvePoll
        await this.voting.resolvePoll(this.params.address, 1, { from: alice });

        // assertion
        (await this.voting.polls(this.params.address, 1)).pollState
          .toString()
          .should.be.eq('2');

        (await this.params.get(
          web3.utils.fromAscii('params:support_required_pct'),
        ))
          .toString()
          .should.eq('60');
        // check nonce of each user
        (await this.factory.lastMsTimes(alice))
          .toNumber()
          .should.eq(nonce.alice);
        (await this.factory.lastMsTimes(bob)).toNumber().should.eq(nonce.bob);
        (await this.factory.lastMsTimes(owner))
          .toNumber()
          .should.eq(nonce.owner);
      });
    });
  });
});
