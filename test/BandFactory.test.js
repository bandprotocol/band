const { reverting } = require('openzeppelin-solidity/test/helpers/shouldFail');

const BandFactory = artifacts.require('BandFactory');

const BandToken = artifacts.require('BandToken');
const CommunityToken = artifacts.require('CommunityToken');
const Parameters = artifacts.require('Parameters');
const CommunityCore = artifacts.require('CommunityCore');

const AdminSimple = artifacts.require('./AdminSimple.sol');
const CommitRevealVoting = artifacts.require('CommitRevealVoting');

require('chai').should();

contract('BandFactory', ([owner, alice, bob]) => {
  beforeEach(async () => {
    this.contract = await BandFactory.deployed();
    this.band = await BandToken.at(await this.contract.band());
  });
  afterEach(async () => {
    const aliceBalance = await this.band.balanceOf(alice);
    const bobBalance = await this.band.balanceOf(bob);
    if (!aliceBalance.isZero()) {
      await this.band.transfer(owner, aliceBalance, { from: alice });
    }
    if (!bobBalance.isZero()) {
      await this.band.transfer(owner, bobBalance, { from: bob });
    }
  });
  it('should create band contract', async () => {
    (await this.band.name()).should.eq('BandToken');
    (await this.band.symbol()).should.eq('BAND');
    (await this.band.decimals()).toString().should.eq('18');
  });
  it('should be recognized by BandToken', async () => {
    (await this.band.execDelegator()).should.eq(this.contract.address);
  });

  it('should be able to transfer feelessly', async () => {
    const transferData = this.band.contract.methods.transferFeeless(
      owner, alice, 100000
    ).encodeABI();
    const nonce = 0;
    const dataNoFuncSig = '0x' + transferData.slice(10 + 64);
    const sig = await web3.eth.sign(
      web3.utils.soliditySha3(nonce, dataNoFuncSig),
      owner
    );
    await this.contract.sendDelegatedExecution(
      owner,
      this.band.address,
      '0x' + transferData.slice(2, 10),
      dataNoFuncSig,
      sig,
      { from: bob },
    );
    (await this.band.balanceOf(alice)).toString().should.eq('100000');
  });

  it('should revert, did not use latest nonce of this user', async () => {
    const transferData = this.band.contract.methods.transferFeeless(
      owner, alice, 100000
    ).encodeABI();
    let nonce = 1;
    const dataNoFuncSig = '0x' + transferData.slice(10 + 64);
    let sig = await web3.eth.sign(
      web3.utils.soliditySha3(nonce, dataNoFuncSig),
      owner
    );
    await this.contract.sendDelegatedExecution(
      owner,
      this.band.address,
      '0x' + transferData.slice(2, 10),
      dataNoFuncSig,
      sig,
      { from: bob },
    );
    (await this.band.balanceOf(alice)).toString().should.eq('100000');
    await reverting(this.contract.sendDelegatedExecution(
      owner,
      this.band.address,
      '0x' + transferData.slice(2, 10),
      dataNoFuncSig,
      sig,
      { from: bob },
    ));
    nonce = 13;
    sig = await web3.eth.sign(
      web3.utils.soliditySha3(nonce, dataNoFuncSig),
      owner
    );
    await reverting(this.contract.sendDelegatedExecution(
      owner,
      this.band.address,
      '0x' + transferData.slice(2, 10),
      dataNoFuncSig,
      sig,
      { from: bob },
    ));
  });

  context('Create new community', () => {
    beforeEach(async () => {
      await this.contract.createNewCommunity(
        'CoinHatcher',
        'XCH',
        18,
        CommitRevealVoting.address,
        [
          web3.utils.fromAscii('core:admin_contract'),
          web3.utils.fromAscii('core:reward_period'),
          web3.utils.fromAscii('core:reward_edit_period'),
          web3.utils.fromAscii('params:commit_time'),
          web3.utils.fromAscii('params:reveal_time'),
          web3.utils.fromAscii('params:support_required_pct'),
          web3.utils.fromAscii('params:min_participation_pct'),
          web3.utils.fromAscii('admin:min_deposit'),
          web3.utils.fromAscii('admin:apply_stage_length'),
          web3.utils.fromAscii('admin:support_required_pct'),
          web3.utils.fromAscii('admin:min_participation_pct'),
          web3.utils.fromAscii('admin:commit_time'),
          web3.utils.fromAscii('admin:reveal_time'),
          web3.utils.fromAscii('admin:reward_percentage'),
        ],
        [
          AdminSimple.address,
          '120',
          '120',
          '60',
          '60',
          '70',
          '10',
          '100',
          '60',
          '50',
          '10',
          '60',
          '60',
          '50',
        ],
        [8, 1, 0, 2],
        { from: owner },
      );
      const addressCore = await this.contract.cores(0);
      this.core = await CommunityCore.at(addressCore);
      this.params = await Parameters.at(await this.core.params());
      this.token = await CommunityToken.at(await this.core.commToken());
    });
    it('should create new community', async () => {
      (await this.token.name()).should.eq('CoinHatcher');
      (await this.token.symbol()).should.eq('XCH');
      (await this.token.decimals()).toString().should.eq('18');
    });

    it('should be recognized by core, params, token', async () => {
      (await this.core.execDelegator()).should.eq(this.contract.address);
      (await this.params.execDelegator()).should.eq(this.contract.address);
      (await this.token.execDelegator()).should.eq(this.contract.address);
    });

    it('should allow getting existing parameters', async () => {
      (await this.params.get(
        web3.utils.fromAscii('params:support_required_pct'),
      ))
        .toString()
        .should.eq('70');
      (await this.params.getZeroable(
        web3.utils.fromAscii('params:support_required_pct'),
      ))
        .toString()
        .should.eq('70');
    });

    it('should only allow getting zero if called via getZeroable', async () => {
      await reverting(this.params.get(web3.utils.fromAscii('xxxxxx')));
      (await this.params.getZeroable(web3.utils.fromAscii('xxxxxx')))
        .toString()
        .should.eq('0');
    });

    it('should be able to transferAndCall feelessly', async () => {
      await this.band.transfer(alice, 100000, { from: owner });

      const calldata = this.core.contract.methods
        .buy(alice, 0, 100)
        .encodeABI();
      const transferData = this.band.contract.methods.transferAndCall(
        alice,
        this.core.address,
        11000,
        '0x' + calldata.slice(2, 10),
        '0x' + calldata.slice(138)
      ).encodeABI();

      const nonce = 0;
      const dataNoFuncSig = '0x' + transferData.slice(10 + 64);
      const sig = await web3.eth.sign(
        web3.utils.soliditySha3(nonce, dataNoFuncSig),
        alice
      );

      await this.contract.sendDelegatedExecution(
        alice,
        this.band.address,
        '0x' + transferData.slice(2, 10),
        dataNoFuncSig,
        sig,
        { from: bob },
      );
      (await this.band.balanceOf(alice)).toString().should.eq('90000');
      (await this.token.balanceOf(alice)).toString().should.eq('100');
      (await this.core.curveMultiplier()).toString().should.eq('1000000000000');
    });

    it('should allow buying tokens if calling via band tokens', async () => {
      await this.band.transfer(alice, 100000, { from: owner });
      await this.band.transfer(bob, 100000, { from: owner });
      const calldata = this.core.contract.methods
        .buy(alice, 0, 100)
        .encodeABI();
      await this.band.transferAndCall(
        alice,
        this.core.address,
        30000,
        '0x' + calldata.slice(2, 10),
        '0x' + calldata.slice(138),
        { from: alice },
      );
      (await this.band.balanceOf(alice)).toString().should.eq('70000');
      (await this.token.balanceOf(alice)).toString().should.eq('200');
      (await this.core.curveMultiplier()).toString().should.eq('1000000000000');
    });
    it('should revert if use new voting address', async () => {
      const newVote = await CommitRevealVoting.new({ from: alice });
      await reverting(
        this.contract.createNewCommunity(
          'CoinHatcher2',
          'XC2',
          18,
          newVote.address,
          [
            web3.utils.fromAscii('core:admin_contract'),
            web3.utils.fromAscii('core:reward_period'),
            web3.utils.fromAscii('core:reward_edit_period'),
            web3.utils.fromAscii('params:commit_time'),
            web3.utils.fromAscii('params:reveal_time'),
            web3.utils.fromAscii('params:support_required_pct'),
            web3.utils.fromAscii('params:min_participation_pct'),
            web3.utils.fromAscii('admin:min_deposit'),
            web3.utils.fromAscii('admin:apply_stage_length'),
            web3.utils.fromAscii('admin:support_required_pct'),
            web3.utils.fromAscii('admin:min_participation_pct'),
            web3.utils.fromAscii('admin:commit_time'),
            web3.utils.fromAscii('admin:reveal_time'),
            web3.utils.fromAscii('admin:reward_percentage'),
          ],
          [
            AdminSimple.address,
            '120',
            '120',
            '60',
            '60',
            '70',
            '10',
            '100',
            '60',
            '50',
            '10',
            '60',
            '60',
            '50',
          ],
          [8, 1, 0, 2],
          { from: alice },
        ),
      );
    });
    it('should create new community if add new voting address to factory', async () => {
      const newVote = await CommitRevealVoting.new({ from: alice });
      await this.contract.addVotingContract(newVote.address);

      await this.contract.createNewCommunity(
        'CoinHatcher2',
        'XC2',
        18,
        newVote.address,
        [
          web3.utils.fromAscii('core:admin_contract'),
          web3.utils.fromAscii('core:reward_period'),
          web3.utils.fromAscii('core:reward_edit_period'),
          web3.utils.fromAscii('params:commit_time'),
          web3.utils.fromAscii('params:reveal_time'),
          web3.utils.fromAscii('params:support_required_pct'),
          web3.utils.fromAscii('params:min_participation_pct'),
          web3.utils.fromAscii('admin:min_deposit'),
          web3.utils.fromAscii('admin:apply_stage_length'),
          web3.utils.fromAscii('admin:support_required_pct'),
          web3.utils.fromAscii('admin:min_participation_pct'),
          web3.utils.fromAscii('admin:commit_time'),
          web3.utils.fromAscii('admin:reveal_time'),
          web3.utils.fromAscii('admin:reward_percentage'),
        ],
        [
          AdminSimple.address,
          '120',
          '120',
          '60',
          '60',
          '70',
          '10',
          '100',
          '60',
          '50',
          '10',
          '60',
          '60',
          '50',
        ],
        [8, 1, 0, 2],
        { from: alice },
      );
      const addressCore = await this.contract.cores(8);
      const currentCore = await CommunityCore.at(addressCore);
      const currentToken = await CommunityToken.at(
        await currentCore.commToken(),
      );
      (await currentToken.name()).should.eq('CoinHatcher2');
      (await currentToken.symbol()).should.eq('XC2');
      (await currentToken.decimals()).toString().should.eq('18');
    });
  });
});
