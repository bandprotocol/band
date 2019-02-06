import React from 'react'
import { Image, Flex, Box, Button, Text, Card } from 'ui/common'
import { colors } from 'ui'
import styled from 'styled-components'
import BN from 'utils/bignumber'
import DotLoading from 'components/DotLoading'

const AmountInput = styled.input`
  width: 100%;
  padding: 12px 20px;
  border: 0px;
  font-size: 16px;
`
const SymbolType = styled(Box)`
  -webkit-appearance: none !important;
  flex: 0 0 60px;
  color: ${colors.text.grey};
  border: 0px;
  padding-right: 10px;
  line-height: 15px;
  margin: auto;
`

const BoxStyle = {
  height: '45px',
  border: '1px solid #cbcfe3',
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
      py={3}
      bg={type === 'buy' ? '#ffffff' : '#e7ecff'}
      style={{ height: '50px', cursor: 'pointer' }}
      onClick={() => setType('buy')}
    >
      <Text
        color={colors.purple.dark}
        letterSpacing="-0.18px"
        fontSize={2}
        fontWeight="bold"
        textAlign="center"
      >
        BUY
      </Text>
    </Box>
    {/* Sell */}
    <Box
      flex={1}
      py={3}
      bg={type === 'buy' ? '#e7ecff' : '#ffffff'}
      style={{ height: '50px', cursor: 'pointer' }}
      onClick={() => setType('sell')}
    >
      <Text
        color={colors.purple.dark}
        letterSpacing="-0.18px"
        fontSize={2}
        fontWeight="bold"
        textAlign="center"
      >
        SELL
      </Text>
    </Box>
  </Flex>
)

const TokenIndex = ({ name, logo }) => (
  <Box bg="#f4f6ff" my={3} style={BoxStyle}>
    <Flex flexDirection="row">
      <Image
        src={logo}
        borderRadius="50%"
        width="25px"
        height="25px"
        m={2}
        ml={3}
      />
      <Text fonySize={0} color={colors.purple.dark} pl={2} py={3}>
        {name}
      </Text>
    </Flex>
  </Box>
)

const Amount = ({ amountStatus, symbol, amount, handleChange }) => (
  <Box pb={3}>
    <Text
      fontSize={0}
      color={colors.purple.dark}
      fontWeight="bold"
      letterSpacing="-0.16px"
    >
      Amount
    </Text>
    <Box bg="#ffffff" mt={3} style={BoxStyle}>
      <Flex flexDirection="row">
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

const EstimatedPrice = ({ price, priceStatus, loading }) => (
  <Box>
    <Text
      fontSize={0}
      color={colors.purple.dark}
      fontWeight="bold"
      letterSpacing="-0.16px"
    >
      Estimated Price
    </Text>
    <Box
      bg="#f4f6ff"
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
            color={colors.purple.dark}
            pl={3}
            py={3}
            style={{
              width: '300px',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
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
  showAdvance,
  toggleAdvance,
  priceLimit,
  priceLimitStatus,
  handleChange,
}) => (
  <Box
    bg="#ffffff"
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
          fontSize={0}
          color={colors.purple.dark}
          fontWeight="bold"
          letterSpacing="-0.16px"
        >
          Advance
        </Text>
        <Box
          flex="0 0 20px"
          style={{ cursor: 'pointer' }}
          onClick={toggleAdvance}
        >
          {showAdvance ? (
            <i class="fas fa-angle-up" />
          ) : (
            <i class="fas fa-angle-down" />
          )}
        </Box>
      </Flex>
      <Box style={{ height: `${showAdvance ? '90px' : '0px'}` }} px={4}>
        {!!showAdvance && (
          <React.Fragment>
            <Box
              bg="#ffffff"
              mt={3}
              style={{
                height: '45px',
                border: '1px solid #cbcfe3',
                borderRadius: '2px',
              }}
            >
              <AmountInput
                type="text"
                name="priceLimit"
                value={priceLimit}
                placeholder="Price Limit ex. 10000.00"
                onChange={e => handleChange(e)}
              />
            </Box>
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
          </React.Fragment>
        )}
      </Box>
    </Flex>
  </Box>
)

const BuySellButton = ({ type, amount, symbol, disabled, onClick }) => (
  <Button
    variant={
      // submit is green, cancel is red
      disabled ? 'disable' : type === 'buy' ? 'submit' : 'cancel'
    }
    my={3}
    width="395px"
    style={{ height: '60px' }}
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
  price,
  priceLimit,
  amountStatus,
  priceStatus,
  priceLimitStatus,
  loading,
  handleChange,
  setType,
  showAdvance,
  toggleAdvance,
  onButtonClick,
}) => (
  <Card variant="modal">
    <Flex
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      py={0}
    >
      {/* Header */}
      <BuySellHeader type={type} setType={setType} />
      {/* Content */}
      <Flex flexDirection="column" justifyContent="flex-start" mt={3} px={3}>
        <Box px={3}>
          <TokenIndex name={name} logo={logo} />
          <Amount
            symbol={symbol}
            amount={amount}
            amountStatus={amountStatus}
            handleChange={handleChange.bind(null, 'amount')}
          />
          <EstimatedPrice
            price={price}
            priceStatus={priceStatus}
            loading={loading}
          />
          <Advance
            showAdvance={showAdvance}
            toggleAdvance={toggleAdvance}
            priceLimit={priceLimit}
            priceLimitStatus={priceLimitStatus}
            handleChange={handleChange.bind(null, 'priceLimit')}
          />
        </Box>
        <BuySellButton
          type={type}
          amount={amount}
          symbol={symbol}
          disabled={
            amountStatus !== 'OK' ||
            priceStatus !== 'OK' ||
            priceLimitStatus !== 'OK'
          }
          onClick={onButtonClick}
        />
      </Flex>
    </Flex>
  </Card>
)
