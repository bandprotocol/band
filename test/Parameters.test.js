const { reverting } = require('openzeppelin-solidity/test/helpers/shouldFail');
const {
  increase,
  duration,
} = require('openzeppelin-solidity/test/helpers/time');

const AdminTCR = artifacts.require('AdminTCR');
const BandToken = artifacts.require('BandToken');
const CommunityCore = artifacts.require('CommunityCore');
const CommunityToken = artifacts.require('CommunityToken');
const Parameters = artifacts.require('Parameters');
const Voting = artifacts.require('Voting');

require('chai').should();

contract('Parameters', ([_, owner, alice, bob, carol]) => {
  beforeEach(async () => {
    this.band = await BandToken.new(1000000, { from: owner });
    this.comm = await CommunityToken.new('CoinHatcher', 'XCH', 18, {
      from: owner,
    });
    this.voting = await Voting.new(this.comm.address, { from: owner });
    this.params = await Parameters.new(
      this.voting.address,
      [
        web3.utils.fromAscii('params:commit_time'),
        web3.utils.fromAscii('params:reveal_time'),
        web3.utils.fromAscii('params:support_required_pct'),
        web3.utils.fromAscii('params:min_participation_pct'),
      ],
      [60, 60, 80, 60],
      { from: owner },
    );
    this.admin = await AdminTCR.new(
      this.comm.address,
      this.voting.address,
      this.params.address,
      { from: owner },
    );  
    this.core = await CommunityCore.new(
      this.band.address,
      this.comm.address,
      this.params.address,
      [8, 1, 0, 2],
      {
        from: owner,
      },
    );
    await this.params.propose(
      [web3.utils.fromAscii('core:admin_contract')],
      [this.admin.address],
      {
        from: owner,
      },
    );
    await increase(duration.days(30));
    await this.voting.resolvePoll(this.params.address, 1, { from: owner });
    await this.band.transfer(alice, 100000, { from: owner });
    await this.band.transfer(bob, 100000, { from: owner });
    await this.comm.transferOwnership(this.core.address, { from: owner });
    await this.core.activate(0, { from: owner });

    // alice buy 100 XCH
    const calldata1 = this.core.contract.methods.buy(_, 0, 100).encodeABI();
    await this.band.transferAndCall(
      this.core.address,
      11000,
      '0x' + calldata1.slice(2, 10),
      '0x' + calldata1.slice(138),
      { from: alice },
    );

    // bob buy 100 XCH
    const calldata2 = this.core.contract.methods.buy(_, 0, 100).encodeABI();
    await this.band.transferAndCall(
      this.core.address,
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
      )).toString().should.eq('80');
      (await this.params.getZeroable(
        web3.utils.fromAscii('params:support_required_pct'),
      )).toString().should.eq('80');
    });

    it('should only allow getting zero if called via getZeroable', async () => {
      await reverting(this.params.get(web3.utils.fromAscii('xxxxxx')));
      (await this.params.getZeroable(web3.utils.fromAscii('xxxxxx'))).toString().should.eq('0');
    });
  });

  context('Checking parameter requirements', () => {
    it('should be Inconclusive case(participants less than minimum participation)', async () => {
      await this.params.propose(
        [web3.utils.fromAscii('example_proposal')],
        [1000000], 
        { 
          from: owner,
        }
      );

      // commitvote
      await this.voting.commitVote(
        this.params.address,
        2,
        web3.utils.soliditySha3(20, 0, 42),
        { from: alice },
      );
      await this.voting.commitVote(
        this.params.address,
        2,
        web3.utils.soliditySha3(10, 0, 42),
        { from: bob },
      )
      await increase(duration.seconds(60));

      // reveal vote
      await this.voting.revealVote(this.params.address, 2, 20, 0, 42, {
        from: alice,
      });
      await this.voting.revealVote(this.params.address, 2, 10, 0, 42, {
        from: bob,
      });
      await increase(duration.seconds(60));

      // resolvePoll
      await this.voting.resolvePoll(this.params.address, 2, { from: alice });

      // assertion
      (await this.voting.polls(this.params.address, 2)).pollState.toString().should.be.eq('4');
    });

    it('should be Yes case(participants more than minimum participation)', async () => {
      await this.params.propose(
        [web3.utils.fromAscii('example_proposal')],
        [1000000], 
        { 
          from: owner,
        }
      );

      // commitvote
      await this.voting.commitVote(
        this.params.address,
        2,
        web3.utils.soliditySha3(60, 0, 42),
        { from: alice },
      );
      await this.voting.commitVote(
        this.params.address,
        2,
        web3.utils.soliditySha3(60, 0, 42),
        { from: bob },
      );
    
      await increase(duration.seconds(60));

      // reveal vote
      await this.voting.revealVote(this.params.address, 2, 60, 0, 42, {
        from: alice,
      });
      await this.voting.revealVote(this.params.address, 2, 60, 0, 42, {
        from: bob,
      });

      await increase(duration.seconds(60));

      // resolvePoll
      await this.voting.resolvePoll(this.params.address, 2, { from: alice });

      //assertion
      (await this.voting.polls(this.params.address, 2)).pollState.toString().should.be.eq('2');
    });

    it('should be No case(votes Yes less than support_required_pct)', async () => {
      await this.params.propose(
        [web3.utils.fromAscii('example_proposal')],
        [1000000], 
        { 
          from: owner,
        }
      );

      // commitvote
      await this.voting.commitVote(
        this.params.address,
        2,
        web3.utils.soliditySha3(10, 70, 42),
        { from: alice },
      );
      await this.voting.commitVote(
        this.params.address,
        2,
        web3.utils.soliditySha3(40, 20, 42),
        { from: bob },
      );
    
      await increase(duration.seconds(60));

      // reveal vote
      await this.voting.revealVote(this.params.address, 2, 10, 70, 42, {
        from: alice,
      });
      await this.voting.revealVote(this.params.address, 2, 40, 20, 42, {
        from: bob,
      });

      await increase(duration.seconds(60));

      // resolvePoll
      await this.voting.resolvePoll(this.params.address, 2, { from: alice });

      //assertion
      (await this.voting.polls(this.params.address, 2)).pollState.toString().should.be.eq('3');
    });

    it('should change params:support_required_pct to 60', async () => {
      await this.params.propose(
        [web3.utils.fromAscii('params:support_required_pct')],
        [60], 
        { 
          from: owner,
        }
      );

      // commitvote
      await this.voting.commitVote(
        this.params.address,
        2,
        web3.utils.soliditySha3(100, 0, 42),
        { from: alice },
      );
      await this.voting.commitVote(
        this.params.address,
        2,
        web3.utils.soliditySha3(100, 0, 42),
        { from: bob },
      );
    
      await increase(duration.seconds(60));

      // reveal vote
      await this.voting.revealVote(this.params.address, 2, 100, 0, 42, {
        from: alice,
      });
      await this.voting.revealVote(this.params.address, 2, 100, 0, 42, {
        from: bob,
      });

      await increase(duration.seconds(60));

      // resolvePoll
      await this.voting.resolvePoll(this.params.address, 2, { from: alice });

      //assertion
      (await this.voting.polls(
        this.params.address, 
        2,
        )).pollState.toString().should.be.eq('2');

      (await this.params.get(
        web3.utils.fromAscii('params:support_required_pct'),
      )).toString().should.eq('60');
    });
  });
});
