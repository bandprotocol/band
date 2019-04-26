const { shouldFail } = require('openzeppelin-test-helpers');

const BandFactory = artifacts.require('BandFactory');

const BandToken = artifacts.require('BandToken');
const BondingCurve = artifacts.require('BondingCurve');
const CommunityToken = artifacts.require('CommunityToken');
const Parameters = artifacts.require('Parameters');
const CommunityCore = artifacts.require('CommunityCore');

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
    const transferData = this.band.contract.methods
      .transferFeeless(owner, alice, 100000)
      .encodeABI();
    const nonce = 0;
    const dataNoFuncSig = '0x' + transferData.slice(10 + 64);
    const sig = await web3.eth.sign(
      web3.utils.soliditySha3(nonce, dataNoFuncSig),
      owner,
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
    const transferData = this.band.contract.methods
      .transferFeeless(owner, alice, 100000)
      .encodeABI();
    let nonce = 1;
    const dataNoFuncSig = '0x' + transferData.slice(10 + 64);
    let sig = await web3.eth.sign(
      web3.utils.soliditySha3(nonce, dataNoFuncSig),
      owner,
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
    await shouldFail.reverting(
      this.contract.sendDelegatedExecution(
        owner,
        this.band.address,
        '0x' + transferData.slice(2, 10),
        dataNoFuncSig,
        sig,
        { from: bob },
      ),
    );
    nonce = 13;
    sig = await web3.eth.sign(
      web3.utils.soliditySha3(nonce, dataNoFuncSig),
      owner,
    );
    await shouldFail.reverting(
      this.contract.sendDelegatedExecution(
        owner,
        this.band.address,
        '0x' + transferData.slice(2, 10),
        dataNoFuncSig,
        sig,
        { from: bob },
      ),
    );
  });

  context('Create new community', () => {
    beforeEach(async () => {
      await this.contract.createNewCommunity(
        'CoinHatcher',
        'XCH',
        [
          web3.utils.fromAscii('core:reward_period'),
          web3.utils.fromAscii('core:reward_edit_period'),
          web3.utils.fromAscii('params:commit_time'),
          web3.utils.fromAscii('params:reveal_time'),
          web3.utils.fromAscii('params:support_required_pct'),
          web3.utils.fromAscii('params:min_participation_pct'),
        ],
        ['120', '120', '60', '60', '70', '10'],
        [8, 1, 0, 2],
        { from: owner },
      );
      const addressCore = await this.contract.cores(0);
      this.core = await CommunityCore.at(addressCore);
      this.curve = await BondingCurve.at(await this.core.bondingCurve());
      this.params = await Parameters.at(await this.core.params());
      this.token = await CommunityToken.at(await this.core.token());
    });
    it('should create new community', async () => {
      (await this.token.name()).should.eq('CoinHatcher');
      (await this.token.symbol()).should.eq('XCH');
      (await this.token.decimals()).toString().should.eq('18');
    });

    it('should be recognized by core, params, token', async () => {
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
      await shouldFail.reverting(
        this.params.get(web3.utils.fromAscii('xxxxxx')),
      );
      (await this.params.getZeroable(web3.utils.fromAscii('xxxxxx')))
        .toString()
        .should.eq('0');
    });

    it('should be able to transferAndCall feelessly', async () => {
      await this.band.transfer(alice, 100000, { from: owner });

      const calldata = this.curve.contract.methods
        .buy(alice, 0, 100)
        .encodeABI();
      const transferData = this.band.contract.methods
        .transferAndCall(
          alice,
          this.curve.address,
          11000,
          '0x' + calldata.slice(2, 10),
          '0x' + calldata.slice(138),
        )
        .encodeABI();

      const nonce = 0;
      const dataNoFuncSig = '0x' + transferData.slice(10 + 64);
      const sig = await web3.eth.sign(
        web3.utils.soliditySha3(nonce, dataNoFuncSig),
        alice,
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
      (await this.curve.curveMultiplier())
        .toString()
        .should.eq('1000000000000000000');
    });

    it('should allow buying tokens if calling via band tokens', async () => {
      await this.band.transfer(alice, 100000, { from: owner });
      await this.band.transfer(bob, 100000, { from: owner });
      const calldata = this.curve.contract.methods
        .buy(alice, 0, 100)
        .encodeABI();
      await this.band.transferAndCall(
        alice,
        this.curve.address,
        30000,
        '0x' + calldata.slice(2, 10),
        '0x' + calldata.slice(138),
        { from: alice },
      );
      (await this.band.balanceOf(alice)).toString().should.eq('70000');
      (await this.token.balanceOf(alice)).toString().should.eq('200');
      (await this.curve.curveMultiplier())
        .toString()
        .should.eq('1000000000000000000');
    });
  });
});
