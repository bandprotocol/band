const { shouldFail, time } = require('openzeppelin-test-helpers');

const BandToken = artifacts.require('BandToken');
const VestingWallet = artifacts.require('VestingWallet');

contract('VestingWallet', ([_, owner, alice, bob]) => {
  beforeEach(async () => {
    this.band = await BandToken.new({ from: owner });
    await this.band.mint(owner, 1000000, { from: owner });
  });
  context(
    'With one year token locking, starting 2020/02, with 3 month cliff',
    () => {
      beforeEach(async () => {
        // The owner sets Alice's balance to be locked for 1000 tokens,
        // starting from 2020/02/01 for 1 year with 3 months cliff.
        // await this.contract.setTokenLock(alice, 7, 10, 19, 1000, {
        //   from: owner,
        // });
        this.wallet = await VestingWallet.new(
          this.band.address,
          alice,
          3,
          1588291200,
          1000,
          [
            1590969600,
            1593561600,
            1596240000,
            1598918400,
            1601510400,
            1604188800,
            1606780800,
            1609459200,
            1612137600,
          ],
          { from: owner },
        );
        await this.band.transfer(this.wallet.address, 1000, { from: owner });
      });

      it('should only allow transfer after the cliff ends', async () => {
        await time.increaseTo(1581724800); // 2020/02/15 (0.5 months)
        await shouldFail.reverting(this.wallet.release({ from: alice }));
        await time.increaseTo(1584230400); // 2020/03/15 (1.5 months)
        await shouldFail.reverting(this.wallet.release({ from: alice }));
        await time.increaseTo(1586908800); // 2020/04/15 (2.5 months)
        await shouldFail.reverting(this.wallet.release({ from: alice }));
        await time.increaseTo(1589500800); // 2020/05/15 (3.5 months) - 1/4 vested

        // Can release now
        await this.wallet.release({ from: alice });
        await shouldFail.reverting(this.wallet.release({ from: alice }));
        (await this.band.balanceOf(alice)).toString().should.eq('250');

        await time.increaseTo(1610668800); // 2021/01/15 (11.5 months)
        // 11/12 vested - locked balance should be floor(1/12*1000).
        await this.wallet.release({ from: alice });
        (await this.band.balanceOf(alice)).toString().should.eq('917');
        await time.increaseTo(1613347200); // 2021/02/01
        // All fully vested. 1000 should transfer to alice
        await this.wallet.release({ from: alice });
        (await this.band.balanceOf(alice)).toString().should.eq('1000');
      });

      it('should revoke by owner', async () => {
        this.wallet = await VestingWallet.new(
          this.band.address,
          alice,
          3,
          1619827200,
          1000,
          [
            1622505600,
            1625097600,
            1627776000,
            1630454400,
            1633046400,
            1635724800,
            1638316800,
            1640995200,
            1643673600,
          ],
          { from: owner },
        );
        await this.band.transfer(this.wallet.address, 1000, { from: owner });
        await time.increaseTo(1625098900); // 5 month later

        // Can release now
        await this.wallet.release({ from: alice });
        (await this.band.balanceOf(alice)).toString().should.eq('417');

        await time.increaseTo(1643673600);
        await this.wallet.revoke({ from: owner });
        (await this.band.balanceOf(owner)).toNumber().should.eq(1000000 - 1417);
        (await this.band.balanceOf(this.wallet.address))
          .toNumber()
          .should.eq(0);
        // await shouldFail.throwing(this.wallet.release({ from: alice }));
      });
    },
  );
});
