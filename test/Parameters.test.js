const { shouldFail, time } = require('openzeppelin-test-helpers');

const BandToken = artifacts.require('BandToken');
const BandRegistry = artifacts.require('BandRegistry');
const BondingCurve = artifacts.require('BondingCurve');
const CommunityCore = artifacts.require('CommunityCore');
const CommunityToken = artifacts.require('CommunityToken');
const Parameters = artifacts.require('Parameters');
const BondingCurveExpression = artifacts.require('BondingCurveExpression');

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

      const testCurve = await BondingCurveExpression.new([8, 1, 0, 2]);
      const data = await this.factory.createCommunity(
        'CoinHatcher',
        'CHT',
        testCurve.address,
        '0',
        '60',
        '200000000000000000',
        '500000000000000000',
      );
      this.core = await CommunityCore.at(data.receipt.logs[0].args.community);
      this.comm = await CommunityToken.at(await this.core.token());
      this.curve = await BondingCurve.at(await this.core.bondingCurve());
      this.params = await Parameters.at(await this.core.params());

      await this.band.transfer(owner, 5000000, { from: _ });
      await this.band.transfer(alice, 500000, { from: owner });
      await this.band.transfer(bob, 500000, { from: owner });
    });

    context('Checking basic functionalities', () => {
      it('should allow getting existing parameters', async () => {
        (await this.params.get(
          web3.utils.fromAscii('params:support_required_pct'),
        ))
          .toString()
          .should.eq('500000000000000000');
      });
      it('should revert if key does not exited', async () => {
        await shouldFail.reverting(
          this.params.get(web3.utils.fromAscii('params:support_require_pct')),
        );
      });
    });

    context('Checking parameter requirements', () => {
      it('should be Reject (participants less than minimum participation)', async () => {
        // alice buy 100 XCH
        const calldata1 = this.curve.contract.methods
          .buy(_, 0, 100)
          .encodeABI();
        await this.band.transferAndCall(
          alice,
          this.curve.address,
          11000,
          '0x' + calldata1.slice(2, 10),
          '0x' + calldata1.slice(138),
          { from: alice },
        );

        // bob buy 500 XCH
        const calldata2 = this.curve.contract.methods
          .buy(_, 0, 500)
          .encodeABI();
        await this.band.transferAndCall(
          bob,
          this.curve.address,
          400000,
          '0x' + calldata2.slice(2, 10),
          '0x' + calldata2.slice(138),
          { from: bob },
        );
        await this.params.propose(
          owner,
          '0xed468fdf3997ff072cd4fa4a58f962616c52e990e4ccd9febb59bb86b308a75d',
          [web3.utils.fromAscii('example_proposal')],
          [1000000],
          {
            from: owner,
          },
        );

        // vote
        await this.params.voteOnProposal(alice, 0, true, {
          from: alice,
        });
        await time.increase(time.duration.seconds(60));

        // resolvePoll
        await this.params.resolve(0, { from: alice });

        // assertion
        (await this.params.proposals(0)).proposalState
          .toString()
          .should.be.eq('3');
      });

      it('should revert if votingPower equal 0', async () => {
        const calldata1 = this.curve.contract.methods
          .buy(_, 0, 100)
          .encodeABI();
        await this.band.transferAndCall(
          alice,
          this.curve.address,
          11000,
          '0x' + calldata1.slice(2, 10),
          '0x' + calldata1.slice(138),
          { from: alice },
        );

        await this.params.propose(
          owner,
          '0xed468fdf3997ff072cd4fa4a58f962616c52e990e4ccd9febb59bb86b308a75d',
          [web3.utils.fromAscii('example_proposal')],
          [1000000],
          {
            from: owner,
          },
        );

        // bob buy 500 XCH
        const calldata2 = this.curve.contract.methods
          .buy(_, 0, 500)
          .encodeABI();
        await this.band.transferAndCall(
          bob,
          this.curve.address,
          400000,
          '0x' + calldata2.slice(2, 10),
          '0x' + calldata2.slice(138),
          { from: bob },
        );
        await shouldFail.reverting(
          this.params.voteOnProposal(bob, 0, true, {
            from: bob,
          }),
        );
      });

      it('should be Yes and need to resolve', async () => {
        // alice buy 100 XCH
        const calldata1 = this.curve.contract.methods
          .buy(_, 0, 100)
          .encodeABI();
        await this.band.transferAndCall(
          alice,
          this.curve.address,
          11000,
          '0x' + calldata1.slice(2, 10),
          '0x' + calldata1.slice(138),
          { from: alice },
        );

        // bob buy 200 XCH
        const calldata2 = this.curve.contract.methods
          .buy(_, 0, 200)
          .encodeABI();
        await this.band.transferAndCall(
          bob,
          this.curve.address,
          100000,
          '0x' + calldata2.slice(2, 10),
          '0x' + calldata2.slice(138),
          { from: bob },
        );
        await this.params.propose(
          owner,
          '0xed468fdf3997ff072cd4fa4a58f962616c52e990e4ccd9febb59bb86b308a75d',
          [web3.utils.fromAscii('example_proposal')],
          [1000000],
          {
            from: owner,
          },
        );

        // vote
        await this.params.voteOnProposal(alice, 0, true, {
          from: alice,
        });

        await time.increase(time.duration.seconds(60));

        // resolvePoll
        await this.params.resolve(0, { from: alice });

        // assertion
        (await this.params.proposals(0)).proposalState
          .toString()
          .should.be.eq('2');
      });

      it('should be Yes (cannot revote and vote after endtime)', async () => {
        // alice buy 100 XCH
        const calldata1 = this.curve.contract.methods
          .buy(_, 0, 100)
          .encodeABI();
        await this.band.transferAndCall(
          alice,
          this.curve.address,
          11000,
          '0x' + calldata1.slice(2, 10),
          '0x' + calldata1.slice(138),
          { from: alice },
        );

        // bob buy 200 XCH
        const calldata2 = this.curve.contract.methods
          .buy(_, 0, 200)
          .encodeABI();
        await this.band.transferAndCall(
          bob,
          this.curve.address,
          100000,
          '0x' + calldata2.slice(2, 10),
          '0x' + calldata2.slice(138),
          { from: bob },
        );
        await this.params.propose(
          owner,
          '0xed468fdf3997ff072cd4fa4a58f962616c52e990e4ccd9febb59bb86b308a75d',
          [web3.utils.fromAscii('example_proposal')],
          [1000000],
          {
            from: owner,
          },
        );

        // vote
        await this.params.voteOnProposal(alice, 0, true, {
          from: alice,
        });

        await time.increase(time.duration.seconds(30));
        await shouldFail.reverting(
          this.params.voteOnProposal(alice, 0, false, {
            from: alice,
          }),
        );

        await time.increase(time.duration.seconds(30));
        // Time end
        await shouldFail.reverting(
          this.params.voteOnProposal(bob, 0, false, {
            from: bob,
          }),
        );

        // resolvePoll
        await this.params.resolve(0, { from: alice });

        // assertion
        (await this.params.proposals(0)).proposalState
          .toString()
          .should.be.eq('2');
      });

      it('should be Yes and auto resolve', async () => {
        // alice buy 100 XCH
        const calldata1 = this.curve.contract.methods
          .buy(_, 0, 100)
          .encodeABI();
        await this.band.transferAndCall(
          alice,
          this.curve.address,
          11000,
          '0x' + calldata1.slice(2, 10),
          '0x' + calldata1.slice(138),
          { from: alice },
        );

        // bob buy 200 XCH
        const calldata2 = this.curve.contract.methods
          .buy(_, 0, 200)
          .encodeABI();
        await this.band.transferAndCall(
          bob,
          this.curve.address,
          100000,
          '0x' + calldata2.slice(2, 10),
          '0x' + calldata2.slice(138),
          { from: bob },
        );
        await this.params.propose(
          owner,
          '0xed468fdf3997ff072cd4fa4a58f962616c52e990e4ccd9febb59bb86b308a75d',
          [web3.utils.fromAscii('example_proposal')],
          [1000000],
          {
            from: owner,
          },
        );

        // vote
        await this.params.voteOnProposal(bob, 0, true, {
          from: bob,
        });

        // Bob power(200) more than 1/2 of community (150), so it will auto resolve after bob votes.

        // assertion
        (await this.params.proposals(0)).proposalState
          .toString()
          .should.be.eq('2');
      });

      it('should be No and need to resolve', async () => {
        // alice buy 100 XCH
        const calldata1 = this.curve.contract.methods
          .buy(_, 0, 100)
          .encodeABI();
        await this.band.transferAndCall(
          alice,
          this.curve.address,
          11000,
          '0x' + calldata1.slice(2, 10),
          '0x' + calldata1.slice(138),
          { from: alice },
        );

        // bob buy 200 XCH
        const calldata2 = this.curve.contract.methods
          .buy(_, 0, 200)
          .encodeABI();
        await this.band.transferAndCall(
          bob,
          this.curve.address,
          100000,
          '0x' + calldata2.slice(2, 10),
          '0x' + calldata2.slice(138),
          { from: bob },
        );
        await this.params.propose(
          owner,
          '0xed468fdf3997ff072cd4fa4a58f962616c52e990e4ccd9febb59bb86b308a75d',
          [web3.utils.fromAscii('example_proposal')],
          [1000000],
          {
            from: owner,
          },
        );

        // vote
        await this.params.voteOnProposal(alice, 0, false, {
          from: alice,
        });

        await time.increase(time.duration.seconds(60));

        // resolvePoll
        await this.params.resolve(0, { from: alice });

        // assertion
        (await this.params.proposals(0)).proposalState
          .toString()
          .should.be.eq('3');
      });

      it('should be No and auto resolve', async () => {
        // alice buy 100 XCH
        const calldata1 = this.curve.contract.methods
          .buy(_, 0, 100)
          .encodeABI();
        await this.band.transferAndCall(
          alice,
          this.curve.address,
          11000,
          '0x' + calldata1.slice(2, 10),
          '0x' + calldata1.slice(138),
          { from: alice },
        );

        // bob buy 200 XCH
        const calldata2 = this.curve.contract.methods
          .buy(_, 0, 200)
          .encodeABI();
        await this.band.transferAndCall(
          bob,
          this.curve.address,
          100000,
          '0x' + calldata2.slice(2, 10),
          '0x' + calldata2.slice(138),
          { from: bob },
        );
        await this.params.propose(
          owner,
          '0xed468fdf3997ff072cd4fa4a58f962616c52e990e4ccd9febb59bb86b308a75d',
          [web3.utils.fromAscii('example_proposal')],
          [1000000],
          {
            from: owner,
          },
        );

        // vote
        await this.params.voteOnProposal(alice, 0, true, {
          from: alice,
        });

        // vote
        await this.params.voteOnProposal(bob, 0, false, {
          from: bob,
        });

        // Bob power(200) more than 1/2 of community (150), so it will auto resolve after bob votes.

        // assertion
        (await this.params.proposals(0)).proposalState
          .toString()
          .should.be.eq('3');
      });

      it('should revert if it does not resolve and can get value if proposal was resolved', async () => {
        // alice buy 100 XCH
        const calldata1 = this.curve.contract.methods
          .buy(_, 0, 100)
          .encodeABI();
        await this.band.transferAndCall(
          alice,
          this.curve.address,
          11000,
          '0x' + calldata1.slice(2, 10),
          '0x' + calldata1.slice(138),
          { from: alice },
        );

        // bob buy 200 XCH
        const calldata2 = this.curve.contract.methods
          .buy(_, 0, 200)
          .encodeABI();
        await this.band.transferAndCall(
          bob,
          this.curve.address,
          100000,
          '0x' + calldata2.slice(2, 10),
          '0x' + calldata2.slice(138),
          { from: bob },
        );

        await this.params.propose(
          owner,
          '0xed468fdf3997ff072cd4fa4a58f962616c52e990e4ccd9febb59bb86b308a75d',
          [web3.utils.fromAscii('example_proposal')],
          [1000000],
          {
            from: owner,
          },
        );

        await shouldFail.reverting(
          this.params.get(web3.utils.fromAscii('example_proposal')),
        );

        // vote
        await this.params.voteOnProposal(alice, 0, true, {
          from: alice,
        });

        await time.increase(time.duration.seconds(60));
        await this.params.resolve(0, { from: alice });

        (await this.params.get(web3.utils.fromAscii('example_proposal')))
          .toNumber()
          .should.be.eq(1000000);
      });

      it('should be Yes and auto resolve (Edge case)', async () => {
        // alice buy 100 XCH
        const calldata1 = this.curve.contract.methods
          .buy(_, 0, 100)
          .encodeABI();
        await this.band.transferAndCall(
          alice,
          this.curve.address,
          11000,
          '0x' + calldata1.slice(2, 10),
          '0x' + calldata1.slice(138),
          { from: alice },
        );

        // bob buy 100 XCH
        const calldata2 = this.curve.contract.methods
          .buy(_, 0, 100)
          .encodeABI();
        await this.band.transferAndCall(
          bob,
          this.curve.address,
          100000,
          '0x' + calldata2.slice(2, 10),
          '0x' + calldata2.slice(138),
          { from: bob },
        );
        await this.params.propose(
          owner,
          '0xed468fdf3997ff072cd4fa4a58f962616c52e990e4ccd9febb59bb86b308a75d',
          [web3.utils.fromAscii('example_proposal')],
          [1000000],
          {
            from: owner,
          },
        );

        // vote
        await this.params.voteOnProposal(bob, 0, true, {
          from: bob,
        });

        // Bob power(100) >=  1/2 of community (100), so it will auto resolve after bob votes.

        // assertion
        (await this.params.proposals(0)).proposalState
          .toString()
          .should.be.eq('2');
      });

      it('should be No and need to resolve (Edge case)', async () => {
        // alice buy 100 XCH
        const calldata1 = this.curve.contract.methods
          .buy(_, 0, 100)
          .encodeABI();
        await this.band.transferAndCall(
          alice,
          this.curve.address,
          11000,
          '0x' + calldata1.slice(2, 10),
          '0x' + calldata1.slice(138),
          { from: alice },
        );

        // bob buy 100 XCH
        const calldata2 = this.curve.contract.methods
          .buy(_, 0, 100)
          .encodeABI();
        await this.band.transferAndCall(
          bob,
          this.curve.address,
          100000,
          '0x' + calldata2.slice(2, 10),
          '0x' + calldata2.slice(138),
          { from: bob },
        );
        await this.params.propose(
          owner,
          '0xed468fdf3997ff072cd4fa4a58f962616c52e990e4ccd9febb59bb86b308a75d',
          [web3.utils.fromAscii('example_proposal')],
          [1000000],
          {
            from: owner,
          },
        );

        // vote
        await this.params.voteOnProposal(alice, 0, false, {
          from: alice,
        });

        // alice vote not greater than 100 so it not be auto resolve

        await time.increase(time.duration.seconds(60));

        // resolvePoll
        await this.params.resolve(0, { from: alice });

        // assertion
        (await this.params.proposals(0)).proposalState
          .toString()
          .should.be.eq('3');
      });

      it('should change params:support_required_pct to 60', async () => {
        // alice buy 100 XCH
        const calldata1 = this.curve.contract.methods
          .buy(_, 0, 100)
          .encodeABI();
        await this.band.transferAndCall(
          alice,
          this.curve.address,
          11000,
          '0x' + calldata1.slice(2, 10),
          '0x' + calldata1.slice(138),
          { from: alice },
        );

        // bob buy 200 XCH
        const calldata2 = this.curve.contract.methods
          .buy(_, 0, 200)
          .encodeABI();
        await this.band.transferAndCall(
          bob,
          this.curve.address,
          100000,
          '0x' + calldata2.slice(2, 10),
          '0x' + calldata2.slice(138),
          { from: bob },
        );
        await this.params.propose(
          owner,
          '0xed468fdf3997ff072cd4fa4a58f962616c52e990e4ccd9febb59bb86b308a75d',
          [web3.utils.fromAscii('example_proposal')],
          [1000000],
          {
            from: owner,
          },
        );

        // vote
        await this.params.voteOnProposal(bob, 0, true, {
          from: bob,
        });

        await this.params.propose(
          owner,
          '0xed468fdf3997ff072cd4fa4a58f962616c52e990e4ccd9febb59bb86b308a75d',
          [web3.utils.fromAscii('params:support_required_pct')],
          ['600000000000000000'],
          {
            from: owner,
          },
        );

        // vote
        await this.params.voteOnProposal(alice, 1, true, {
          from: alice,
        });
        await this.params.voteOnProposal(bob, 1, true, {
          from: bob,
        });

        // assertion
        (await this.params.proposals(1)).proposalState
          .toString()
          .should.be.eq('2');

        (await this.params.get(
          web3.utils.fromAscii('params:support_required_pct'),
        ))
          .toString()
          .should.eq('600000000000000000');
      });

      it('should support feeless execution', async () => {
        // alice buy 100 XCH
        const calldata1 = this.curve.contract.methods
          .buy(_, 0, 100)
          .encodeABI();
        await this.band.transferAndCall(
          alice,
          this.curve.address,
          11000,
          '0x' + calldata1.slice(2, 10),
          '0x' + calldata1.slice(138),
          { from: alice },
        );

        // bob buy 200 XCH
        const calldata2 = this.curve.contract.methods
          .buy(_, 0, 200)
          .encodeABI();
        await this.band.transferAndCall(
          bob,
          this.curve.address,
          100000,
          '0x' + calldata2.slice(2, 10),
          '0x' + calldata2.slice(138),
          { from: bob },
        );

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
        data = await this.params.contract.methods
          .voteOnProposal(alice, 0, false)
          .encodeABI();
        dataNoFuncSig = '0x' + data.slice(10 + 64);
        sig = await web3.eth.sign(
          web3.utils.soliditySha3(++nonce.alice, dataNoFuncSig),
          alice,
        );
        await this.factory.sendDelegatedExecution(
          alice,
          this.params.address,
          '0x' + data.slice(2, 10),
          nonce.alice,
          dataNoFuncSig,
          sig,
          { from: owner },
        );
        // bob commit vote
        data = await this.params.contract.methods
          .voteOnProposal(bob, 0, true)
          .encodeABI();
        dataNoFuncSig = '0x' + data.slice(10 + 64);
        sig = await web3.eth.sign(
          web3.utils.soliditySha3(++nonce.bob, dataNoFuncSig),
          bob,
        );
        await this.factory.sendDelegatedExecution(
          bob,
          this.params.address,
          '0x' + data.slice(2, 10),
          nonce.bob,
          dataNoFuncSig,
          sig,
          { from: owner },
        );

        // assertion
        (await this.params.proposals(0)).proposalState
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
