const { shouldFail } = require('openzeppelin-test-helpers');

const CommunityToken = artifacts.require('CommunityToken');

require('chai').should();

contract(
  'LockableToken',
  ([_, owner, alice, bob, carol, locker1, locker2, locker3]) => {
    beforeEach(async () => {
      this.token = await CommunityToken.new('Test', 'T', 18, { from: owner });
      await this.token.mint(alice, 1000, { from: owner });
      await this.token.mint(bob, 1000, { from: owner });
      await this.token.addCapper(locker1, { from: owner });
      await this.token.addCapper(locker2, { from: owner });
      await this.token.addCapper(locker3, { from: owner });
    });
    context('Lock by single locker', () => {
      it('Should lock if locker is a capper of token', async () => {
        await this.token.lock(alice, 100, { from: locker1 });
        (await this.token.getLockedToken(alice)).toNumber().should.eq(100);
        (await this.token.unlockedBalanceOf(alice)).toNumber().should.eq(900);

        await this.token.lock(alice, 200, { from: locker1 });
        (await this.token.unlockedBalanceOf(alice)).toNumber().should.eq(700);
      });
      it('Should revert if lock by other', async () => {
        await shouldFail.reverting(this.token.lock(bob, 200, { from: carol }));
      });
      it('Should cannot tranfer token more than unlock token', async () => {
        await this.token.lock(alice, 400, { from: locker1 });
        await shouldFail.reverting(
          this.token.transfer(bob, 700, { from: alice }),
        );

        await this.token.unlock(alice, 200, { from: locker1 });
        await this.token.transfer(bob, 700, { from: alice });
        (await this.token.balanceOf(alice)).toNumber().should.eq(300);
        (await this.token.unlockedBalanceOf(alice)).toNumber().should.eq(100);
      });
    });
    context('Lock by muntiple locker', () => {
      it('Should can lock if locker is a capper of token', async () => {
        await this.token.lock(alice, 100, { from: locker1 });
        (await this.token.getLockedToken(alice)).toNumber().should.eq(100);
        (await this.token.unlockedBalanceOf(alice)).toNumber().should.eq(900);

        await this.token.lock(alice, 200, { from: locker2 });
        (await this.token.unlockedBalanceOf(alice)).toNumber().should.eq(800);
      });
      it('Should revert if unlock more than lock', async () => {
        await shouldFail.reverting(
          this.token.unlock(bob, 200, { from: locker1 }),
        );
      });
      it('Should find max lock from all lockers', async () => {
        await this.token.lock(alice, 400, { from: locker1 });
        await this.token.lock(alice, 500, { from: locker2 });
        await this.token.lock(alice, 600, { from: locker3 });

        (await this.token.balanceOf(alice)).toNumber().should.eq(1000);
        (await this.token.unlockedBalanceOf(alice)).toNumber().should.eq(400);
        (await this.token.getLockedToken(alice)).toNumber().should.eq(600);

        await this.token.unlock(alice, 200, { from: locker3 });
        (await this.token.balanceOf(alice)).toNumber().should.eq(1000);
        (await this.token.unlockedBalanceOf(alice)).toNumber().should.eq(500);
        (await this.token.getLockedToken(alice)).toNumber().should.eq(500);

        await this.token.unlock(alice, 500, { from: locker2 });
        (await this.token.balanceOf(alice)).toNumber().should.eq(1000);
        (await this.token.unlockedBalanceOf(alice)).toNumber().should.eq(600);
        (await this.token.getLockedToken(alice)).toNumber().should.eq(400);

        await this.token.unlock(alice, 400, { from: locker3 });
        (await this.token.balanceOf(alice)).toNumber().should.eq(1000);
        (await this.token.unlockedBalanceOf(alice)).toNumber().should.eq(600);
        (await this.token.getLockedToken(alice)).toNumber().should.eq(400);

        await this.token.unlock(alice, 200, { from: locker1 });
        (await this.token.balanceOf(alice)).toNumber().should.eq(1000);
        (await this.token.unlockedBalanceOf(alice)).toNumber().should.eq(800);
        (await this.token.getLockedToken(alice)).toNumber().should.eq(200);

        await this.token.unlock(alice, 200, { from: locker1 });
        (await this.token.balanceOf(alice)).toNumber().should.eq(1000);
        (await this.token.unlockedBalanceOf(alice)).toNumber().should.eq(1000);
        (await this.token.getLockedToken(alice)).toNumber().should.eq(0);

        await shouldFail.reverting(
          this.token.unlock(alice, 0, { from: locker1 }),
        );
      });
    });
  },
);
