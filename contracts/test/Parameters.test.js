const { shouldFail, time } = require('openzeppelin-test-helpers');

const BandToken = artifacts.require('BandToken');
const BandRegistry = artifacts.require('BandRegistry');
const BondingCurve = artifacts.require('BondingCurve');
const CommunityToken = artifacts.require('CommunityToken');
const Parameters = artifacts.require('Parameters');
const BondingCurveExpression = artifacts.require('BondingCurveExpression');
const CommunityFactory = artifacts.require('CommunityFactory');

require('chai').should();

contract('Parameters', ([_, owner, alice, bob]) => {
  context('After successful initialization', () => {
    beforeEach(async () => {
      this.registry = await BandRegistry.deployed();
      this.commFactory = await CommunityFactory.new(this.registry.address, {
        from: owner,
      });
      this.band = await BandToken.at(await this.registry.band());
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
      const data = await this.commFactory.create(
        'CoinHatcher',
        'CHT',
        testCurve.address,
        '0',
        '60',
        '200000000000000000',
        '500000000000000000',
        { from: owner },
      );

      this.comm = await CommunityToken.at(data.receipt.logs[2].args.token);
      this.curve = await BondingCurve.at(
        data.receipt.logs[2].args.bondingCurve,
      );
      this.params = await Parameters.at(data.receipt.logs[2].args.params);

      await this.band.transfer(owner, 5000000, { from: _ });
      await this.band.transfer(alice, 500000, { from: owner });
      await this.band.transfer(bob, 500000, { from: owner });
    });

    context('Checking basic functionalities', () => {
      it('should allow getting existing parameters', async () => {
        (await this.params.getRaw(
          web3.utils.fromAscii('params:support_required_pct'),
        ))
          .toString()
          .should.eq('500000000000000000');
      });
      it('should revert if key does not exited', async () => {
        await shouldFail.reverting(
          this.params.getRaw(
            web3.utils.fromAscii('params:support_require_pct'),
          ),
        );
      });
    });
    context('Set function for owner', () => {
      beforeEach(async () => {
        this.params = await Parameters.new(this.comm.address, { from: owner });
      });
      it('Should set new parameter by owner', async () => {
        await this.params.set(
          web3.utils.fromAscii('test:'),
          [web3.utils.fromAscii('param1')],
          [30000],
          {
            from: owner,
          },
        );

        (await this.params.get(
          web3.utils.fromAscii('test:'),
          web3.utils.fromAscii('param1'),
        ))
          .toNumber()
          .should.eq(30000);
      });

      it('Should revert if set by other', async () => {
        await shouldFail.reverting(
          this.params.set(
            web3.utils.fromAscii('test:'),
            [web3.utils.fromAscii('param1')],
            [30000],
            {
              from: bob,
            },
          ),
        );

        await shouldFail.reverting(
          this.params.get(
            web3.utils.fromAscii('test:'),
            web3.utils.fromAscii('param1'),
          ),
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
          this.curve.address,
          400000,
          '0x' + calldata2.slice(2, 10),
          '0x' + calldata2.slice(138),
          { from: bob },
        );
        await this.params.propose(
          '0xed468fdf3997ff072cd4fa4a58f962616c52e990e4ccd9febb59bb86b308a75d',
          [web3.utils.fromAscii('example_proposal')],
          [1000000],
          {
            from: owner,
          },
        );

        // vote
        await this.params.vote(0, true, {
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
          this.curve.address,
          11000,
          '0x' + calldata1.slice(2, 10),
          '0x' + calldata1.slice(138),
          { from: alice },
        );

        await this.params.propose(
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
          this.curve.address,
          400000,
          '0x' + calldata2.slice(2, 10),
          '0x' + calldata2.slice(138),
          { from: bob },
        );
        await shouldFail.reverting(
          this.params.vote(0, true, {
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
          this.curve.address,
          100000,
          '0x' + calldata2.slice(2, 10),
          '0x' + calldata2.slice(138),
          { from: bob },
        );
        await this.params.propose(
          '0xed468fdf3997ff072cd4fa4a58f962616c52e990e4ccd9febb59bb86b308a75d',
          [web3.utils.fromAscii('example_proposal')],
          [1000000],
          {
            from: owner,
          },
        );

        // vote
        await this.params.vote(0, true, {
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
          this.curve.address,
          100000,
          '0x' + calldata2.slice(2, 10),
          '0x' + calldata2.slice(138),
          { from: bob },
        );
        await this.params.propose(
          '0xed468fdf3997ff072cd4fa4a58f962616c52e990e4ccd9febb59bb86b308a75d',
          [web3.utils.fromAscii('example_proposal')],
          [1000000],
          {
            from: owner,
          },
        );

        // vote
        await this.params.vote(0, true, {
          from: alice,
        });

        await time.increase(time.duration.seconds(30));
        await shouldFail.reverting(
          this.params.vote(0, false, {
            from: alice,
          }),
        );

        await time.increase(time.duration.seconds(30));
        // Time end
        await shouldFail.reverting(
          this.params.vote(0, false, {
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
          this.curve.address,
          100000,
          '0x' + calldata2.slice(2, 10),
          '0x' + calldata2.slice(138),
          { from: bob },
        );
        await this.params.propose(
          '0xed468fdf3997ff072cd4fa4a58f962616c52e990e4ccd9febb59bb86b308a75d',
          [web3.utils.fromAscii('example_proposal')],
          [1000000],
          {
            from: owner,
          },
        );

        // vote
        await this.params.vote(0, true, {
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
          this.curve.address,
          100000,
          '0x' + calldata2.slice(2, 10),
          '0x' + calldata2.slice(138),
          { from: bob },
        );
        await this.params.propose(
          '0xed468fdf3997ff072cd4fa4a58f962616c52e990e4ccd9febb59bb86b308a75d',
          [web3.utils.fromAscii('example_proposal')],
          [1000000],
          {
            from: owner,
          },
        );

        // vote
        await this.params.vote(0, false, {
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
          this.curve.address,
          100000,
          '0x' + calldata2.slice(2, 10),
          '0x' + calldata2.slice(138),
          { from: bob },
        );
        await this.params.propose(
          '0xed468fdf3997ff072cd4fa4a58f962616c52e990e4ccd9febb59bb86b308a75d',
          [web3.utils.fromAscii('example_proposal')],
          [1000000],
          {
            from: owner,
          },
        );

        // vote
        await this.params.vote(0, true, {
          from: alice,
        });

        // vote
        await this.params.vote(0, false, {
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
          this.curve.address,
          100000,
          '0x' + calldata2.slice(2, 10),
          '0x' + calldata2.slice(138),
          { from: bob },
        );

        await this.params.propose(
          '0xed468fdf3997ff072cd4fa4a58f962616c52e990e4ccd9febb59bb86b308a75d',
          [web3.utils.fromAscii('example_proposal')],
          [1000000],
          {
            from: owner,
          },
        );

        await shouldFail.reverting(
          this.params.getRaw(web3.utils.fromAscii('example_proposal')),
        );

        // vote
        await this.params.vote(0, true, {
          from: alice,
        });

        await time.increase(time.duration.seconds(60));
        await this.params.resolve(0, { from: alice });

        (await this.params.getRaw(web3.utils.fromAscii('example_proposal')))
          .toNumber()
          .should.be.eq(1000000);
      });

      it('should be Yes and auto resolve (Edge case)', async () => {
        // alice buy 100 XCH
        const calldata1 = this.curve.contract.methods
          .buy(_, 0, 100)
          .encodeABI();
        await this.band.transferAndCall(
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
          this.curve.address,
          100000,
          '0x' + calldata2.slice(2, 10),
          '0x' + calldata2.slice(138),
          { from: bob },
        );
        await this.params.propose(
          '0xed468fdf3997ff072cd4fa4a58f962616c52e990e4ccd9febb59bb86b308a75d',
          [web3.utils.fromAscii('example_proposal')],
          [1000000],
          {
            from: owner,
          },
        );

        // vote
        await this.params.vote(0, true, {
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
          this.curve.address,
          100000,
          '0x' + calldata2.slice(2, 10),
          '0x' + calldata2.slice(138),
          { from: bob },
        );
        await this.params.propose(
          '0xed468fdf3997ff072cd4fa4a58f962616c52e990e4ccd9febb59bb86b308a75d',
          [web3.utils.fromAscii('example_proposal')],
          [1000000],
          {
            from: owner,
          },
        );

        // vote
        await this.params.vote(0, false, {
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
          this.curve.address,
          100000,
          '0x' + calldata2.slice(2, 10),
          '0x' + calldata2.slice(138),
          { from: bob },
        );
        await this.params.propose(
          '0xed468fdf3997ff072cd4fa4a58f962616c52e990e4ccd9febb59bb86b308a75d',
          [web3.utils.fromAscii('example_proposal')],
          [1000000],
          {
            from: owner,
          },
        );

        // vote
        await this.params.vote(0, true, {
          from: bob,
        });

        await this.params.propose(
          '0xed468fdf3997ff072cd4fa4a58f962616c52e990e4ccd9febb59bb86b308a75d',
          [web3.utils.fromAscii('params:support_required_pct')],
          ['600000000000000000'],
          {
            from: owner,
          },
        );

        // vote
        await this.params.vote(1, true, {
          from: alice,
        });
        await this.params.vote(1, true, {
          from: bob,
        });

        // assertion
        (await this.params.proposals(1)).proposalState
          .toString()
          .should.be.eq('2');

        (await this.params.getRaw(
          web3.utils.fromAscii('params:support_required_pct'),
        ))
          .toString()
          .should.eq('600000000000000000');
      });
    });
  });
});
