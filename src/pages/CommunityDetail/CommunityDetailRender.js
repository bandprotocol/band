import React from 'react'
import { Flex, Card, Text, Box, Button } from 'ui/common'
import PageContainer from 'components/PageContainer'
import MiniGraph from 'components/MiniGraph'
import CommunityDescription from 'components/CommunityDescription'
import DetailHistory from 'components/DetailHistory'
import BN from 'utils/bignumber'
import { calculateCollateralAt } from 'utils/equation'
import AutoSizer from 'react-virtualized-auto-sizer'
import Graph from 'components/PriceGraph'
import Decimal from 'decimal.js'
import Breadcrumb from 'components/Breadcrumb'

const Field = ({ label, children }) => (
  <Box mb="14px">
    <Text fontSize="14px" fontWeight="500" color="#777777">
      {label}
    </Text>
    <Text
      mt="8px"
      fontSize="18px"
      letterSpacing="0.1px"
      fontWeight={900}
      color="#718bff"
    >
      {children}
    </Text>
  </Box>
)

const Power = ({ label, color, value, children }) => (
  <Flex pb="12px" alignItems="center">
    {label && (
      <Text
        fontWeight="500"
        fontSize="13px"
        mr={1}
        color="#929292"
        style={{ width: 70 }}
      >
        {label}
      </Text>
    )}
    <Box
      flex={1}
      p="1px"
      style={{ borderRadius: '10px', background: '#f5f7ff' }}
    >
      <Box
        style={{
          borderRadius: '10px',
          background: color,
          height: '10px',
          width: `${value * 100}%`,
        }}
      />
    </Box>
    <Text
      fontWeight="900"
      fontSize="13px"
      ml={1}
      color={color}
      style={{ width: 40 }}
    >
      {children}
    </Text>
  </Flex>
)

const getLogPlot = values => {
  const v = values.map(v => Math.log(v + 1))
  const s = v.reduce((c, i) => c + i)
  return v.map(i => i / s)
}

const renderTCD = (
  { dataProviderCount, maxProviderCount, totalStake },
  totalSupply,
) => {
  return (
    <React.Fragment>
      <Box mt="24px" mb="20px">
        <Field label="Governance Method">Token Curated DataSources</Field>
        <Field label="Total Providers">{dataProviderCount}</Field>
        <Field label="Active Providers">
          {Math.min(maxProviderCount, dataProviderCount)}
        </Field>
        <Field label="Total Stake">
          <Power
            color="#718bff"
            value={new Decimal(totalStake.toString())
              .div(new Decimal(totalSupply.toString()))
              .toNumber()}
          >
            {new Decimal(totalStake.toString())
              .mul(100)
              .div(new Decimal(totalSupply.toString()))
              .toFixed(2)}
            %
          </Power>
        </Field>
      </Box>
    </React.Fragment>
  )
}

const renderTCR = tcr => {
  const entries = [tcr.listed, tcr.applied, tcr.challenged, tcr.rejected]
  const plotRatio = getLogPlot(entries)
  const numEntries = entries.reduce((c, i) => c + i)

  return (
    <React.Fragment>
      <Box mt="24px" mb="20px">
        <Field label="Governance Method">Token Curated Registry</Field>
        <Field label="Total Entries">{numEntries}</Field>
      </Box>
      <Box pt="20px" style={{ borderTop: 'solid 1px #dee2f0' }}>
        <Text fontSize="14px" fontWeight="500" color="#777777">
          Entry Distribution{' '}
          <Text color="#cccccc" style={{ display: 'inline-block' }}>
            (log scale)
          </Text>
        </Text>
        <Box mt={3}>
          <Power label="Listed" color="#86dfce" value={plotRatio[0]}>
            {tcr.listed}
          </Power>
          <Power label="Applied" color="#71a8ff" value={plotRatio[1]}>
            {tcr.applied}
          </Power>
          <Power label="Challenged" color="#fad049" value={plotRatio[2]}>
            {tcr.challenged}
          </Power>
          <Power label="Rejected" color="#df8686" value={plotRatio[3]}>
            {tcr.rejected}
          </Power>
        </Box>
      </Box>
    </React.Fragment>
  )
}

export default props => {
  const {
    name,
    address,
    numberOfHolders,
    tokenAddress,
    showBuy,
    showSell,
    symbol,
    price,
    bandPrice,
    marketCap,
    totalSupply,
    collateralEquation,
    tcr,
    // tcd,
  } = props
  return (
    <PageContainer withSidebar style={{ minWidth: 0 }}>
      <Breadcrumb
        links={[
          { path: `/community/${address}`, label: name },
          { path: `/community/${address}/overview`, label: 'Overview' },
        ]}
      />
      <CommunityDescription tokenAddress={tokenAddress} />
      <Flex flexDirection="row" mt="12px" mx="-6px">
        <Card flex={1} variant="dashboard" mx="6px">
          <Text
            mt={1}
            fontSize="15px"
            mt="12px"
            fontWeight="900"
            color="#393939"
          >
            PRICE MOVEMENT
          </Text>
          <Box style={{ height: 220 }}>
            <AutoSizer>
              {({ height, width }) => (
                <Box style={{ height, width }}>
                  <Graph
                    tokenAddress={tokenAddress}
                    height={height}
                    width={width}
                  />
                </Box>
              )}
            </AutoSizer>
          </Box>
          <Flex mb={1}>
            <Box flex={1} pl={2}>
              <Text py={2} fontSize="14px" fontWeight="500" color="#777777">
                Current Price
              </Text>
              <Text
                mt="8px"
                fontSize="25px"
                letterSpacing="0.1px"
                fontWeight={500}
              >
                {BN.parse(price).pretty()} BAND
                <Text
                  ml={2}
                  fontSize="0.7em"
                  style={{ display: 'inline-block' }}
                >
                  / {symbol}
                </Text>
              </Text>
              <Text
                fontSize="18px"
                fontWeight="500"
                lineHeight="2.2em"
                color="#757575"
              >
                {BN.parse(price)
                  .bandToUSD(bandPrice)
                  .pretty()}{' '}
                USD / {symbol}
              </Text>
            </Box>
            <Flex flexDirection="column" justifyContent="center" mr={2}>
              <Button onClick={showBuy} variant="blue">
                <Text fontSize="14px" fontWeight="600">
                  BUY
                </Text>
              </Button>
              <Button mt={2} onClick={showSell} variant="grey">
                <Text fontSize="14px" fontWeight="600">
                  SELL
                </Text>
              </Button>
            </Flex>
          </Flex>
        </Card>
        <Flex flexDirection="column" mx="6px" my="-4px">
          <MiniGraph
            title="Market Cap"
            value={BN.parse(marketCap)
              .bandToUSD(bandPrice)
              .shortPretty()}
            unit="USD"
            subValue={`${BN.parse(marketCap).shortPretty()} BAND`}
          />
          <MiniGraph
            title={'Token Supply'}
            value={BN.parse(totalSupply).shortPretty()}
            unit={symbol}
            subValue={`${BN.parse(
              calculateCollateralAt(
                collateralEquation,
                BN.parse(totalSupply).toString(),
              ).toFixed(0),
            ).pretty()} BAND collateral`}
          />
          <MiniGraph
            title="Total Address"
            value={numberOfHolders}
            unit="Holders"
            subValue={
              numberOfHolders > 0 &&
              `${BN.parse(totalSupply)
                .div(BN.parse(numberOfHolders.toString()))
                .pretty()} ${symbol} on average`
            }
          />
        </Flex>
        <Card
          flex="0 0 290px"
          variant="dashboard"
          mx="6px"
          style={{ boxShadow: '0 2px 9px 4px rgba(0, 0, 0, 0.04)' }}
        >
          <Text fontSize="15px" mt="12px" fontWeight="900" color="#393939">
            DATASET INFORMATION
          </Text>
          {/* {tcd && renderTCD(tcd, totalSupply)} */}
          {tcr && renderTCR(tcr)}
        </Card>
      </Flex>

      <Flex mt="12px">
        <DetailHistory tokenAddress={tokenAddress} pageSize={10} />
      </Flex>
    </PageContainer>
  )
}
