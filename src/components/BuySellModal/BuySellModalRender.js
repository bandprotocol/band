import React from 'react'
import { Image, Flex, Box, Button, Text, Card } from 'ui/common'
import { colors } from 'ui'
import styled from 'styled-components'
import BN from 'utils/bignumber'

const AmountInput = styled.input`
  width: 100%;
  padding: 12px 20px;
  border: 0px;
  font-size: 16px;
`
const SymbolType = styled.input`
  -webkit-appearance: none !important;
  color: ${colors.text.grey};
  font-size: 15px;
  text-align: right;
  width: 75px;
  border: 0px;
  padding-right: 14px;
`

const BoxStyle = {
  width: '370px',
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
      bg={type === 'BUY' ? '#ffffff' : '#e7ecff'}
      style={{ height: '50px', cursor: 'pointer' }}
      onClick={() => setType('BUY')}
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
      bg={type === 'BUY' ? '#e7ecff' : '#ffffff'}
      style={{ height: '50px', cursor: 'pointer' }}
      onClick={() => setType('SELL')}
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
  <Box bg="#f4f6ff" my={3} mx="auto" style={BoxStyle}>
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

const Amount = ({ symbol, handleChange }) => (
  <Box bg="#ffffff" my={3} mx="auto" style={BoxStyle}>
    <Flex flexDirection="row">
      <AmountInput
        type="number"
        name="amount"
        placeholder="ex.100"
        onChange={e => handleChange(e)}
      />
      <SymbolType type="text" value={symbol} disabled />
    </Flex>
  </Box>
)

const Advance = ({ handleChange, showAdvance, toggleAdvance }) => (
  <Box
    bg="#ffffff"
    my={3}
    mx="auto"
    width="370px"
    style={{
      border: '1px solid #cbcfe3',
      borderRadius: '2px',
    }}
    alignItems="center"
  >
    <Flex flexDirection="column">
      <Flex py={3} px={3}>
        <Text
          fontSize={0}
          color={colors.purple.dark}
          fontWeight="bold"
          letterSpacing="-0.16px"
        >
          Advance
        </Text>
        <Box ml="auto" style={{ cursor: 'pointer' }} onClick={toggleAdvance}>
          {showAdvance ? (
            <i class="fas fa-angle-up" />
          ) : (
            <i class="fas fa-angle-down" />
          )}
        </Box>
      </Flex>
      <Box style={{ height: `${showAdvance ? '90px' : '0px'}` }}>
        {showAdvance ? (
          <Box
            bg="#ffffff"
            my={3}
            mx="auto"
            width="330px"
            style={{
              height: '45px',
              border: '1px solid #cbcfe3',
              borderRadius: '2px',
            }}
          >
            <Flex flexDirection="row">
              <AmountInput
                type="number"
                name="priceLimit"
                placeholder="Price Limit ex. 10000.00"
                onChange={e => handleChange(e)}
              />
            </Flex>
          </Box>
        ) : null}
      </Box>
    </Flex>
  </Box>
)

const BuySellButton = ({ name, type, amount, onClick }) => (
  <Button
    variant={
      // submit is green, cancel is red
      amount.isZero() ? 'disable' : type === 'BUY' ? 'submit' : 'cancel'
    }
    my={3}
    width="395px"
    style={{ height: '60px' }}
    mx={3}
    onClick={onClick}
  >
    <Flex flexDirection="row" alignItems="center">
      {type === 'BUY' ? (
        <Text fontSize={2}>Buy {name} Token</Text>
      ) : (
        <Text fontSize={2}>Sell {name} Token</Text>
      )}
      <Text fontSize={2} ml="auto">
        {amount.pretty()}
      </Text>
      <Text pl={2}>CHT</Text>
    </Flex>
  </Button>
)

export default ({
  name,
  logo,
  symbol,
  type,
  price,
  amount,
  handleChange,
  setType,
  showAdvance,
  toggleAdvance,
  onButtonClick,
}) => (
  <Card variant="modal">
    <Flex flexDirection="column" alignItems="center" justifyContent="center">
      {/* Header */}
      <BuySellHeader type={type} setType={setType} />
      {/* Content */}
      <Flex flexDirection="column" justifyContent="flex-start" mt={3}>
        {/* <Text
        fontSize={0}
        color={colors.purple.dark}
        fontWeight="bold"
        letterSpacing="-0.16px"
      >
        Token Index
      </Text> */}
        <TokenIndex name={name} logo={logo} />
        <Text
          fontSize={0}
          color={colors.purple.dark}
          fontWeight="bold"
          ml={4}
          letterSpacing="-0.16px"
        >
          Amount
        </Text>
        <Amount
          symbol={symbol}
          handleChange={handleChange.bind(null, 'amount')}
        />
        <Text
          fontSize={0}
          color={colors.purple.dark}
          fontWeight="bold"
          ml={4}
          letterSpacing="-0.16px"
        >
          Estimated Price
        </Text>
        <Box
          bg="#f4f6ff"
          my={3}
          mx="auto"
          width="370px"
          style={{
            height: '45px',
            border: '1px solid #cbcfe3',
            borderRadius: '2px',
          }}
        >
          {/* TODO: auto filled price */}
          <Flex flexDirection="row">
            {/* <Image src={} /> */}
            <Text fontSize={0} color={colors.purple.dark} pl={3} py={3}>
              {price.pretty()}
            </Text>
          </Flex>
        </Box>
        <Advance
          handleChange={handleChange.bind(null, 'priceLimit')}
          showAdvance={showAdvance}
          toggleAdvance={toggleAdvance}
        />
        <BuySellButton
          type={type}
          name={name}
          amount={amount}
          onClick={onButtonClick}
        />
      </Flex>
    </Flex>
  </Card>
)
