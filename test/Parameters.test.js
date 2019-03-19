const { shouldFail, time } = require('openzeppelin-test-helpers');

const AdminTCR = artifacts.require('AdminTCR');
const BandToken = artifacts.require('BandToken');
const BandFactory = artifacts.require('BandFactory');
const BondingCurve = artifacts.require('BondingCurve');
const CommunityCore = artifacts.require('CommunityCore');
const CommunityToken = artifacts.require('CommunityToken');
const Parameters = artifacts.require('Parameters');
const CommitRevealVoting = artifacts.require('CommitRevealVoting');

require('chai').should();

contract('Parameters', ([_, owner, alice, bob, carol]) => {
  context(
    'should not initialize if a parameter is missing or has impossible value.',
    () => {
      beforeEach(async () => {
        this.band = await BandToken.new(1000000, owner, { from: owner });
        this.comm = await CommunityToken.new('CoinHatcher', 'XCH', 18, {
          from: owner,
        });
        this.voting = await CommitRevealVoting.new({ from: owner });
      });
      it('impossible parameters', async () => {
        await shouldFail.reverting(
          Parameters.new(
            this.comm.address,
            this.voting.address,
            [
              web3.utils.fromAscii('params:commit_time'),
              web3.utils.fromAscii('params:reveal_time'),
              web3.utils.fromAscii('params:support_required_pct'),
              web3.utils.fromAscii('params:min_participation_pct'),
            ],
            [0, 0, 101, 101],
            { from: owner },
          ),
        );
      });
      it('missing a parameter', async () => {
        await shouldFail.reverting(
          Parameters.new(
            this.comm.address,
            this.voting.address,
            [
              web3.utils.fromAscii('params:commit_time'),
              web3.utils.fromAscii('params:reveal_time'),
              web3.utils.fromAscii('params:support_required_pct'),
            ],
            [60, 60, 80],
            { from: owner },
          ),
        );
      });
    },
  );

  context('After successful initialization', () => {
    beforeEach(async () => {
      this.factory = await BandFactory.deployed();
      this.band = await BandToken.new(1000000, owner, { from: owner });
      this.comm = await CommunityToken.new('CoinHatcher', 'XCH', 18, {
        from: owner,
      });
      this.voting = await CommitRevealVoting.new({ from: owner });
      this.params = await Parameters.new(
        this.comm.address,
        this.voting.address,
        [
          web3.utils.fromAscii('params:commit_time'),
          web3.utils.fromAscii('params:reveal_time'),
          web3.utils.fromAscii('params:support_required_pct'),
          web3.utils.fromAscii('params:min_participation_pct'),
        ],
        [60, 60, 80 * 1e12, 60 * 1e12],
        { from: owner },
      );
      await this.params.setExecDelegator(this.factory.address);
      this.core = await CommunityCore.new(
        this.band.address,
        this.comm.address,
        this.params.address,
        [8, 1, 0, 2],
        {
          from: owner,
        },
      );
      this.curve = await BondingCurve.at(await this.core.bondingCurve());
      this.admin = await AdminTCR.new(
        this.core.address,
        this.voting.address,
        [0, 1e12],
        { from: owner },
      );
      await this.params.propose(
        owner,
        '0xed468fdf3997ff072cd4fa4a58f962616c52e990e4ccd9febb59bb86b308a75d',
        [web3.utils.fromAscii('core:admin_contract')],
        [this.admin.address],
        {
          from: owner,
        },
      );
      await time.increase(time.duration.days(30));
      await this.voting.resolvePoll(this.params.address, 1, { from: owner });
      await this.band.transfer(alice, 100000, { from: owner });
      await this.band.transfer(bob, 100000, { from: owner });
      await this.comm.transferOwnership(this.curve.address, { from: owner });

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
          .should.eq('80000000000000');
        (await this.params.getZeroable(
          web3.utils.fromAscii('params:support_required_pct'),
        ))
          .toString()
          .should.eq('80000000000000');
      });

      it('should only allow getting zero if called via getZeroable', async () => {
        await shouldFail.reverting(
          this.params.get(web3.utils.fromAscii('xxxxxx')),
        );
        (await this.params.getZeroable(web3.utils.fromAscii('xxxxxx')))
          .toString()
          .should.eq('0');
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

        // commitvote
        await this.voting.commitVote(
          alice,
          this.params.address,
          2,
          web3.utils.soliditySha3(20, 0, 42),
          '0x00',
          20,
          0,
          { from: alice },
        );
        await this.voting.commitVote(
          bob,
          this.params.address,
          2,
          web3.utils.soliditySha3(10, 0, 42),
          '0x00',
          10,
          0,
          { from: bob },
        );
        await time.increase(time.duration.seconds(60));

        // reveal vote
        await this.voting.revealVote(alice, this.params.address, 2, 20, 0, 42, {
          from: alice,
        });
        await this.voting.revealVote(bob, this.params.address, 2, 10, 0, 42, {
          from: bob,
        });
        await time.increase(time.duration.seconds(60));

        // resolvePoll
        await this.voting.resolvePoll(this.params.address, 2, { from: alice });

        // assertion
        (await this.voting.polls(this.params.address, 2)).pollState
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

        // commitvote
        await this.voting.commitVote(
          alice,
          this.params.address,
          2,
          web3.utils.soliditySha3(60, 0, 42),
          '0x00',
          60,
          0,
          { from: alice },
        );
        await this.voting.commitVote(
          bob,
          this.params.address,
          2,
          web3.utils.soliditySha3(60, 0, 42),
          '0x00',
          60,
          0,
          { from: bob },
        );

        await time.increase(time.duration.seconds(60));

        // reveal vote
        await this.voting.revealVote(alice, this.params.address, 2, 60, 0, 42, {
          from: alice,
        });
        await this.voting.revealVote(bob, this.params.address, 2, 60, 0, 42, {
          from: bob,
        });

        await time.increase(time.duration.seconds(60));

        // resolvePoll
        await this.voting.resolvePoll(this.params.address, 2, { from: alice });

        // assertion
        (await this.voting.polls(this.params.address, 2)).pollState
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

        // commitvote
        await this.voting.commitVote(
          alice,
          this.params.address,
          2,
          web3.utils.soliditySha3(10, 70, 42),
          '0x00',
          80,
          0,
          { from: alice },
        );
        await this.voting.commitVote(
          bob,
          this.params.address,
          2,
          web3.utils.soliditySha3(40, 20, 42),
          '0x00',
          60,
          0,
          { from: bob },
        );

        await time.increase(time.duration.seconds(60));

        // reveal vote
        await this.voting.revealVote(
          alice,
          this.params.address,
          2,
          10,
          70,
          42,
          {
            from: alice,
          },
        );
        await this.voting.revealVote(bob, this.params.address, 2, 40, 20, 42, {
          from: bob,
        });

        await time.increase(time.duration.seconds(60));

        // resolvePoll
        await this.voting.resolvePoll(this.params.address, 2, { from: alice });

        // assertion
        (await this.voting.polls(this.params.address, 2)).pollState
          .toString()
          .should.be.eq('3');
      });

      it('should change params:support_required_pct to 60', async () => {
        await this.params.propose(
          owner,
          '0xed468fdf3997ff072cd4fa4a58f962616c52e990e4ccd9febb59bb86b308a75d',
          [web3.utils.fromAscii('params:support_required_pct')],
          [60],
          {
            from: owner,
          },
        );

        // commitvote
        await this.voting.commitVote(
          alice,
          this.params.address,
          2,
          web3.utils.soliditySha3(100, 0, 42),
          '0x00',
          100,
          0,
          { from: alice },
        );
        await this.voting.commitVote(
          bob,
          this.params.address,
          2,
          web3.utils.soliditySha3(100, 0, 42),
          '0x00',
          100,
          0,
          { from: bob },
        );

        await time.increase(time.duration.seconds(60));

        // reveal vote
        await this.voting.revealVote(
          alice,
          this.params.address,
          2,
          100,
          0,
          42,
          {
            from: alice,
          },
        );
        await this.voting.revealVote(bob, this.params.address, 2, 100, 0, 42, {
          from: bob,
        });

        await time.increase(time.duration.seconds(60));

        // resolvePoll
        await this.voting.resolvePoll(this.params.address, 2, { from: alice });

        // assertion
        (await this.voting.polls(this.params.address, 2)).pollState
          .toString()
          .should.be.eq('2');

        (await this.params.get(
          web3.utils.fromAscii('params:support_required_pct'),
        ))
          .toString()
          .should.eq('60');
      });

      it('should support feeless execution', async () => {
        const nonce = {
          alice: (await this.factory.execNonces(alice)).toNumber(),
          bob: (await this.factory.execNonces(bob)).toNumber(),
          owner: (await this.factory.execNonces(owner)).toNumber(),
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
          web3.utils.soliditySha3(nonce.owner++, dataNoFuncSig),
          owner,
        );
        await this.factory.sendDelegatedExecution(
          owner,
          this.params.address,
          '0x' + data.slice(2, 10),
          dataNoFuncSig,
          sig,
          { from: alice },
        );
        // set voting's execDelegator to factory.
        await this.voting.setExecDelegator(this.factory.address);
        // alice commit vote
        data = await this.voting.contract.methods
          .commitVote(
            alice,
            this.params.address,
            2,
            web3.utils.soliditySha3(100, 0, 42),
            '0x00',
            100,
            0,
          )
          .encodeABI();
        dataNoFuncSig = '0x' + data.slice(10 + 64);
        sig = await web3.eth.sign(
          web3.utils.soliditySha3(nonce.alice++, dataNoFuncSig),
          alice,
        );
        await this.factory.sendDelegatedExecution(
          alice,
          this.voting.address,
          '0x' + data.slice(2, 10),
          dataNoFuncSig,
          sig,
          { from: owner },
        );
        // bob commit vote
        data = await this.voting.contract.methods
          .commitVote(
            bob,
            this.params.address,
            2,
            web3.utils.soliditySha3(100, 0, 42),
            '0x00',
            100,
            0,
          )
          .encodeABI();
        dataNoFuncSig = '0x' + data.slice(10 + 64);
        sig = await web3.eth.sign(
          web3.utils.soliditySha3(nonce.bob++, dataNoFuncSig),
          bob,
        );
        await this.factory.sendDelegatedExecution(
          bob,
          this.voting.address,
          '0x' + data.slice(2, 10),
          dataNoFuncSig,
          sig,
          { from: owner },
        );

        await time.increase(time.duration.seconds(60));

        // reveal vote
        await this.voting.revealVote(
          alice,
          this.params.address,
          2,
          100,
          0,
          42,
          {
            from: owner,
          },
        );
        await this.voting.revealVote(bob, this.params.address, 2, 100, 0, 42, {
          from: owner,
        });

        await time.increase(time.duration.seconds(60));

        // resolvePoll
        await this.voting.resolvePoll(this.params.address, 2, { from: alice });

        // assertion
        (await this.voting.polls(this.params.address, 2)).pollState
          .toString()
          .should.be.eq('2');

        (await this.params.get(
          web3.utils.fromAscii('params:support_required_pct'),
        ))
          .toString()
          .should.eq('60');
        // check nonce of each user
        (await this.factory.execNonces(alice))
          .toNumber()
          .should.eq(nonce.alice);
        (await this.factory.execNonces(bob)).toNumber().should.eq(nonce.bob);
        (await this.factory.execNonces(owner))
          .toNumber()
          .should.eq(nonce.owner);
      });
    });
  });
});
