import React from 'react'
import { Flex, Box, Button, Text } from 'ui/common'
import { colors } from 'ui'
import styled from 'styled-components'
import BN from 'utils/bignumber'
import DotLoading from 'components/DotLoading'
import ToolTip from 'components/ToolTip'

const AmountInput = styled.input`
  width: 100%;
  padding: 12px 20px;
  border: 0px;
  letter-spacing: -0.2px;
  font-size: 12px;
`
const SymbolType = styled(Box)`
  -webkit-appearance: none !important;
  flex: 0 0 60px;
  color: ${colors.text.grey};
  border: 0px;
  font-size: 12px;
  line-height: 15px;
  margin: auto;
`

const BoxStyle = {
  height: '45px',
  border: '1px solid #cbcfe3',
  overflow: 'hidden',
  borderRadius: '2px',
}

const BuySellHeader = ({ type, setType }) => (
  <Flex
    flexDirection="row"
    justifyContent="center"
    alignItems="center"
    width="100%"
  >
    {/* Buy */}
    <Box
      flex={1}
      py="20px"
      bg={type === 'buy' ? '#ffffff' : '#e7ecff'}
      style={{
        height: '50px',
        cursor: 'pointer',
        borderRadius: '6px 0px 0px 0px',
      }}
      onClick={() => setType('buy')}
    >
      <Text
        color="#7c84a6"
        letterSpacing="-0.18px"
        fontSize="16px"
        fontWeight="bold"
        textAlign="center"
      >
        BUY
      </Text>
    </Box>
    {/* Sell */}
    <Box
      flex={1}
      py="20px"
      bg={type === 'buy' ? '#e7ecff' : '#ffffff'}
      style={{
        height: '50px',
        cursor: 'pointer',
        borderRadius: '0px 6px 0px 0px',
      }}
      onClick={() => setType('sell')}
    >
      <Text
        color="#7c84a6"
        letterSpacing="-0.18px"
        fontSize="16px"
        fontWeight="bold"
        textAlign="center"
      >
        SELL
      </Text>
    </Box>
  </Flex>
)

const Amount = ({ type, amountStatus, symbol, amount, handleChange }) => (
  <Box pb={3}>
    <Text
      fontSize="14px"
      color="#4a4a4a"
      fontWeight={500}
      letterSpacing="-0.16px"
    >
      {type === 'buy' ? 'Buying' : 'Paying'}
    </Text>
    <Box bg="#ffffff" mt={3} style={BoxStyle}>
      <Flex flexDirection="row" alignItems="center" justifyContent="center">
        <AmountInput
          type="text"
          name="amount"
          value={amount}
          placeholder="ex.100"
          onChange={e => handleChange(e)}
        />
        <SymbolType>{symbol ? symbol : 'Token'}</SymbolType>
      </Flex>
    </Box>
    {/* Error message */}
    <Text
      fontSize="10px"
      color={colors.red}
      lineHeight="15px"
      style={{ display: 'block', height: '15px' }}
    >
      {amountStatus === 'INVALID_AMOUNT'
        ? 'Invalid amount.'
        : amountStatus === 'INSUFFICIENT_TOKEN'
        ? `Insufficient ${symbol ? symbol : 'Token'} balance.`
        : ' '}
    </Text>
  </Box>
)

const EstimatedPrice = ({ type, price, priceStatus, loading }) => (
  <Box>
    <Flex width={1}>
      <Flex flex={1}>
        <Text
          fontSize="14px"
          color="#4a4a4a"
          fontWeight={500}
          letterSpacing="-0.2px"
        >
          {type === 'buy' ? 'Paying' : 'Receiving'}
        </Text>
      </Flex>
      <Flex flex={1} justifyContent="flex-end">
        <Text fontSize="11px" color="#4e3ca9">
          {`≈ ${BN.isBN(price) ? price.pretty() : price} USD`}
        </Text>
      </Flex>
    </Flex>
    <Box
      mt={3}
      style={{
        height: '45px',
        border: '1px solid #cbcfe3',
        borderRadius: '2px',
      }}
    >
      <Flex flexDirection="row" alignItems="center">
        {loading ? (
          <Box flex={1} pl={2} py="20px">
            <DotLoading color="#b1b8e7" size="6px" />
          </Box>
        ) : (
          <Text
            flex={1}
            fontSize={0}
            pl={3}
            py={3}
            style={{
              width: '300px',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              letterSpacing: '-0.2px',
            }}
          >
            {BN.isBN(price) ? price.pretty() : price}
          </Text>
        )}
        <SymbolType>BAND</SymbolType>
      </Flex>
    </Box>
    <Text
      fontSize="10px"
      color={colors.red}
      lineHeight="15px"
      style={{ display: 'block', height: '15px' }}
    >
      {priceStatus === 'INSUFFICIENT_BAND' ? 'Insufficient BAND balance.' : ' '}
    </Text>
  </Box>
)

const Advance = ({
  type,
  showAdvance,
  toggleAdvance,
  priceLimit,
  priceChange,
  ratio,
  loading,
  priceLimitStatus,
  handlePriceLimit,
  handlePriceChange,
}) => {
  const acceptablePriceChange = ratio
    .mul(BN.parse(type === 'buy' ? 100 + 1.0 * priceChange : 100 - priceChange))
    .div(BN.parse(100.0))
    .clamp(BN.parse(10000000), BN.parse(0))
  return (
    <Box
      bg="#ffffff"
      width={1}
      mt={4}
      mb={3}
      style={{
        border: '1px solid #cbcfe3',
        borderRadius: '2px',
      }}
      alignItems="center"
    >
      <Flex flexDirection="column">
        <Flex py={3} px={3}>
          <Text
            flex={1}
            fontSize="13px"
            color={colors.blue.dark}
            fontWeight="bold"
            letterSpacing="-0.16px"
          >
            Advance Setting
          </Text>
          <Box
            flex="0 0 20px"
            style={{ cursor: 'pointer' }}
            onClick={toggleAdvance}
          >
            {showAdvance ? (
              <i className="fas fa-angle-up" />
            ) : (
              <i className="fas fa-angle-down" />
            )}
          </Box>
        </Flex>
        <Box style={{ height: `${showAdvance ? 'auto' : '0px'}` }} px={4}>
          {!!showAdvance && (
            <React.Fragment>
              <Flex mt="10px" flexDirection="column">
                <Text fontSize="12px">BAND Price limit</Text>
                <Flex
                  bg="white"
                  mt="5px"
                  width={1}
                  alignItems="center"
                  style={{
                    height: '45px',
                    border: '1px solid #cbcfe3',
                    borderRadius: '2px',
                    position: 'relative',
                  }}
                >
                  <Flex style={{ position: 'absolute', right: '10px' }}>
                    <Text fontSize="12px">BAND</Text>
                  </Flex>
                  <AmountInput
                    type="text"
                    name="priceLimit"
                    value={priceLimit}
                    placeholder="Price Limit ex. 10000.00"
                    onChange={e => handlePriceLimit(e)}
                    style={{ width: '90%' }}
                  />
                </Flex>
              </Flex>
              {/* Error Message */}
              <Text
                fontSize="10px"
                color={colors.red}
                lineHeight="15px"
                style={{ display: 'block', height: '15px' }}
              >
                {priceLimitStatus === 'INSUFFICIENT_BUYPRICE'
                  ? 'Insufficient pricelimit for buy price(should be get higher).'
                  : priceLimitStatus === 'INSUFFICIENT_SELLPRICE'
                  ? 'Insufficient pricelimit for sell price(should be get lower).'
                  : priceLimitStatus === 'INVALID_PRICELIMIT'
                  ? 'Invalid pricelimit.'
                  : ' '}
              </Text>
              <Flex mt={3} flexDirection="column">
                <Text fontSize="12px">BAND Price change</Text>
                <Flex
                  bg="white"
                  mt="5px"
                  width={1}
                  alignItems="center"
                  style={{
                    height: '45px',
                    border: '1px solid #cbcfe3',
                    borderRadius: '2px',
                    position: 'relative',
                  }}
                >
                  <Flex style={{ position: 'absolute', right: '10px' }}>
                    <Text fontSize="12px">%</Text>
                  </Flex>
                  <AmountInput
                    type="text"
                    name="priceChange"
                    value={priceChange}
                    placeholder="Price change ex. 10"
                    onChange={e => handlePriceChange(e)}
                    style={{ width: '90%' }}
                  />
                </Flex>
              </Flex>
              <Flex my="10px">
                {isNaN(priceChange) || priceChange < 0 ? (
                  <Text
                    fontSize="10px"
                    color={colors.red}
                    lineHeight="15px"
                    style={{ display: 'block', height: '15px' }}
                  >
                    Invalid pricechange.
                  </Text>
                ) : (
                  !acceptablePriceChange.isZero() && (
                    <Text
                      fontSize="11px"
                      lineHeight={1.45}
                      letterSpacing="-0.1px"
                    >
                      {`The transaction will fail if the price of 1 CHT is ${
                        type === 'buy' ? 'higher' : 'lower'
                      } than ${acceptablePriceChange.pretty()}
                BAND ($${acceptablePriceChange.pretty()})`}
                    </Text>
                  )
                )}
              </Flex>
            </React.Fragment>
          )}
        </Box>
      </Flex>
    </Box>
  )
}

const BuySellButton = ({ type, amount, symbol, disabled, onClick }) => (
  <Button
    variant={disabled ? 'disable' : type === 'buy' ? 'submit' : 'cancel'}
    my={3}
    width="395px"
    style={{
      height: '60px',
      boxShadow: disabled
        ? undefined
        : type === 'buy'
        ? '0 3px 4px 0 #a9f5cd'
        : '0 3px 4px 0 rgba(236, 99, 99, 0.48)',
    }}
    onClick={onClick}
  >
    <Flex
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
    >
      <Box flex="0 0 auto">
        {type === 'buy' ? (
          <Text fontSize={0} textAlign="left">
            Buy Token
          </Text>
        ) : (
          <Text fontSize={0} textAlign="left">
            Sell Token
          </Text>
        )}
      </Box>
      <Flex flex="1 0 80px" flexDirection="row" alignItems="center">
        <Text
          fontSize={2}
          ml="auto"
          width="145px"
          pl={0}
          textAlign="right"
          style={{
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
          }}
        >
          {disabled ? '-' : amount}
        </Text>
        <Text pl={2}>{symbol ? symbol : 'Token'}</Text>
      </Flex>
    </Flex>
  </Button>
)

export default ({
  name,
  logo,
  symbol,
  type,
  amount,
  tokenNormalPrice,
  price,
  priceLimit,
  amountStatus,
  priceStatus,
  priceChange,
  priceLimitStatus,
  loading,
  handleChange,
  setType,
  showAdvance,
  toggleAdvance,
  onButtonClick,
}) => {
  const ratio = (() => {
    try {
      const bnAmount = BN.parse(parseFloat(amount))
      return price.mul(new BN(10).pow(new BN(18))).div(bnAmount)
    } catch (e) {
      return new BN(0)
    }
  })()
  const priceSlippage = (() => {
    try {
      if (type === 'sell' && ratio.isZero()) {
        return new BN(0)
      }
      const tmp = BN.parse(
        type === 'buy'
          ? ratio.mul(new BN(100)).toString() /
              BN.parse(tokenNormalPrice).toString() -
              100.0
          : 100.0 -
              ratio.mul(new BN(100)).toString() /
                BN.parse(tokenNormalPrice).toString(),
      )
      if (tmp.isZero() || tmp.isNeg()) {
        return new BN(0)
      }
      return tmp
    } catch (e) {
      return new BN(0)
    }
  })()
  return (
    <Flex
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      py={0}
      bg="white"
      style={{ borderRadius: '6px', width: '430px' }}
    >
      {/* Header */}
      <BuySellHeader type={type} setType={setType} />
      {/* Content */}
      <Flex
        flexDirection="column"
        justifyContent="flex-start"
        mt="40px"
        px="30px"
      >
        <Amount
          type={type}
          loading={loading}
          symbol={symbol}
          amount={amount}
          amountStatus={amountStatus}
          handleChange={handleChange.bind(null, 'amount')}
        />
        <Flex justifyContent="center" width={1} mb="20px">
          <Text color="#4853ff">
            <i className="fas fa-arrow-up" />
            {` `}
            <i className="fas fa-arrow-down" />
          </Text>
        </Flex>
        <EstimatedPrice
          type={type}
          price={price}
          ratio={ratio.pretty()}
          priceStatus={priceStatus}
          loading={loading}
        />
        <Flex flexDirection="column" mt="20px" fontSize="12px" fontWeight={500}>
          <Flex flexDirection="row">
            <Flex flex={1}>Rate</Flex>
            <Flex flex={6} justifyContent="flex-end" flexDirection="row">
              {loading ? (
                <React.Fragment>
                  <Flex flex={5} />
                  <DotLoading color="#b1b8e7" size="6px" />
                  <Flex flex={1} />
                </React.Fragment>
              ) : (
                <React.Fragment>
                  {`1 ${symbol} = ${ratio.pretty()} BAND `}
                  <Text color="#4e3ca9" ml="5px">
                    ${`(${ratio.pretty()} USD)`}
                  </Text>
                </React.Fragment>
              )}
            </Flex>
          </Flex>
          <Flex flexDirection="row" mt="10px">
            <Flex flex={2} flexDirection="row" alignItems="center">
              <Text mr={1}>Price slippage</Text>
              <ToolTip
                bg={colors.text.grey}
                width="410px"
                textBg="#b2b6be"
                textColor={colors.text.normal}
                bottom={20}
                left={20}
                tip={{ left: 21 }}
              >
                Price slippage refers to the difference between the expected
                price before a transaction is executed and the actual price at
                which it is executed.
              </ToolTip>
            </Flex>
            {loading ? (
              <React.Fragment>
                <Flex flex={4} />
                <DotLoading color="#b1b8e7" size="6px" />
                <Flex flex={1} />
              </React.Fragment>
            ) : (
              <Flex flex={2} justifyContent="flex-end">
                {`${priceSlippage.pretty()} %`}
              </Flex>
            )}
          </Flex>
        </Flex>
        <Advance
          type={type}
          loading={loading}
          showAdvance={showAdvance}
          toggleAdvance={toggleAdvance}
          ratio={ratio}
          priceChange={priceChange}
          priceLimit={priceLimit}
          priceLimitStatus={priceLimitStatus}
          handlePriceLimit={handleChange.bind(null, 'priceLimit')}
          handlePriceChange={handleChange.bind(null, 'priceChange')}
        />
        <Flex width={1}>
          <BuySellButton
            type={type}
            amount={amount}
            symbol={symbol}
            disabled={
              amountStatus !== 'OK' ||
              priceStatus !== 'OK' ||
              priceLimitStatus !== 'OK' ||
              isNaN(priceChange) ||
              priceChange < 0 ||
              loading
            }
            onClick={onButtonClick}
          />
        </Flex>
      </Flex>
    </Flex>
  )
}
