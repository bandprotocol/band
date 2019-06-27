import React from 'react'
import styled from 'styled-components'
import colors from 'ui/colors'
import { Flex, Box, Text, Card, Image, Button, Heading } from 'ui/common'
import PageStructure from 'components/DataSetPageStructure'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import PaginationRender from 'components/Pagination/PaginationRender'
import ClickOutSide from 'react-click-outside'
import moment from 'utils/moment'
import DataHeader from 'components/DataHeader'

import { LogFetcher } from 'data/fetcher/LogFetcher'
import { getProvider, searchProviderAddress } from 'data/Providers'
import { getFormat } from 'data/Format'

import FilterSrc from 'images/filter.svg'
import SearchInputIconSrc from 'images/search-input-icon.svg'
import SecureSrc from 'images/activity-secure.svg'
import CheckSrc from 'images/check.svg'

const SelectionContainer = styled(Box).attrs({
  bg: '#fff',
})`
  padding: 15px;
  width: 260px;
  z-index: 1;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  position: absolute;
  top: 50px;
  right: 0;
  transition: all 350ms;

  ${p =>
    p.show
      ? `
      opacity: 1;
      transform: translateY(0);
    `
      : `
      opacity: 0;
      transform: translateY(-10px);
      pointer-events: none;
    `}
`

const Choice = ({ selected, children, onClick }) => (
  <Flex
    ml={1}
    mt={3}
    alignItems="center"
    style={{ cursor: 'pointer' }}
    onClick={onClick}
  >
    <Card
      border={`solid 1px ${selected ? '#5269ff' : '#393939'}`}
      bg={selected ? '#5269ff' : '#ffffff'}
      borderRadius="6px"
    >
      <Flex
        alignItems="center"
        justifyContent="center"
        style={{ height: 21, width: 21 }}
      >
        {selected && <Image src={CheckSrc} width="12px" />}
      </Flex>
    </Card>
    <Text
      ml={3}
      color={selected ? '#5269ff' : 'inherit'}
      fontSize="14px"
      fontWeight={selected ? '700' : '400'}
    >
      {children}
    </Text>
  </Flex>
)

const SearchBoxInput = styled.input`
  border-radius: 18px;
  border: solid 1px #e7ecff;
  padding: 0 2.8em 0 1.4em;
  width: 200px;
  line-height: 32px;
  font-size: 14px;

  transition: width 300ms;

  &:focus {
    width: 360px;
  }
`

const SearchBox = props => (
  <Box style={{ position: 'relative' }}>
    <SearchBoxInput {...props} />
    <Image
      src={SearchInputIconSrc}
      style={{
        position: 'absolute',
        right: 15,
        top: 8,
      }}
      width={18}
    />
  </Box>
)

const FilterButton = styled(Button).attrs({
  variant: 'blue',
})`
  cursor: pointer;
  font-size: 14px;
  font-weight: 700;
  padding: 0 20px;
  line-height: 36px;
`

const Data = ({ children }) => (
  <Card
    flex="0 0 auto"
    bg="#f3f6ff"
    border="solid 1px #a4bdfe"
    py={1}
    px={3}
    borderRadius="4px"
  >
    <Text ml="auto" fontFamily="code" fontSize={14} fontWeight="bold">
      {children}
    </Text>
  </Card>
)

const Report = ({
  symbol,
  event: {
    data: {
      signature: { r, s, v },
      timestamp,
      value,
    },
    id,
    name,
    actor,
    key: dataKey,
  },
}) => (
  <Flex
    py="18px"
    pl="32px"
    pr="8px"
    style={{ borderBottom: 'solid 1px #eef3ff' }}
    alignItems="flex-start"
  >
    <Jazzicon diameter={28} seed={jsNumberForAddress(actor)} />
    <Box ml="32px" flex={1}>
      <Flex>
        <Text fontSize="14px" fontWeight="700">
          {name}
        </Text>
        <Text fontSize="14px" fontWeight="700" mx={2} color="#4d7dff">
          reported {getFormat(symbol).logIdentifier}
        </Text>
        <Text fontSize="14px" fontWeight="700">
          {dataKey}
        </Text>
      </Flex>
      <Flex mt="10px" alignItems="center">
        <Text mr={2} fontSize="14px" color="#9e9e9e">
          {moment.unix(timestamp).pretty()}
        </Text>
        <Image src={SecureSrc} width="12px" />
        <Text fontSize="14px" ml={1} color="#9baeda">
          signed by {actor}
        </Text>
      </Flex>
    </Box>
    <Data>{getFormat(symbol).formatValue(value)}</Data>
  </Flex>
)

const Broadcast = ({
  symbol,
  event: {
    data: { reported_data, timestamp, tx_hash },
    id,
    name,
    actor,
    key: dataKey,
  },
}) => (
  <Flex
    py="18px"
    pl="32px"
    style={{ borderBottom: 'solid 1px #eef3ff' }}
    alignItems="flex-start"
  >
    <Jazzicon diameter={28} seed={jsNumberForAddress(actor)} />
    <Box ml="32px" flex={1}>
      <Flex>
        <Text fontSize="14px" fontWeight="700">
          Band Protocol
        </Text>
        <Text fontSize="14px" fontWeight="700" mx={2} color="#42c47f">
          reported {getFormat(symbol).logIdentifier}
        </Text>
        <Text fontSize="14px" fontWeight="700">
          {dataKey}
        </Text>
      </Flex>
      <Flex mt="10px" mb="20px" alignItems="center">
        <Text mr={2} fontSize="14px" color="#9e9e9e">
          {moment.unix(timestamp).pretty()}
        </Text>
      </Flex>
      {Object.entries(reported_data)
        .sort((a, b) => (a[0] < b[0] ? -1 : 1))
        .map(([k, { value }]) => (
          <Flex ml={2} alignItems="center" style={{ position: 'relative' }}>
            <Box
              flex="0 0 auto"
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                borderLeft: 'solid 1px #eef3ff',
                transform: 'translateY(-50%)',
              }}
            />
            <Box flex="0 0 15px" style={{ borderTop: 'solid 1px #eef3ff' }} />
            <Flex flex="0 0 150px" alignItems="center">
              <Text mx={2} flex=" 0 0 auto" fontSize="14px" fontWeight="700">
                {getProvider(k).name}
              </Text>
              <Box flex="1" style={{ borderTop: 'solid 1px #eef3ff' }} />
            </Flex>
            <Text flex={1} fontSize="13px" color="#9baeda">
              {k}
            </Text>
            <Box my={1} ml={2}>
              <Data>{getFormat(symbol).formatValue(value)}</Data>
            </Box>
          </Flex>
        ))}
    </Box>
  </Flex>
)

class RenderLogs extends React.Component {
  shouldComponentUpdate(prevProps) {
    return this.props.data !== prevProps.data
  }

  render() {
    return this.props.data
      .map(event => ({ ...event, ...getProvider(event.actor) }))
      .map(event =>
        event.type === 'REPORT' ? (
          <Report key={event.id} event={event} symbol={this.props.symbol} />
        ) : event.type === 'BROADCAST' ? (
          <Broadcast key={event.id} event={event} symbol={this.props.symbol} />
        ) : null,
      )
  }
}

export default props => (
  <PageStructure
    renderHeader={() => (
      <DataHeader
        lines={[
          'Monitor Smart Contract Activities',
          'See How the Data Comes to Life',
          'Band Protocol aggregates data from multiple sources.',
          'The data are validated on the smart contract.',
        ]}
      />
    )}
    {...props}
  >
    <Card
      bg="#ffffff"
      px={4}
      py={3}
      borderRadius="10px"
      boxShadow="0 2px 9px 4px rgba(0, 0, 0, 0.04)"
    >
      <Flex py={2} alignItems="center">
        <Text fontWeight="700" fontSize="20px">
          Activity Logs
        </Text>
        <Box flex={1} />
        {!searchProviderAddress(props.query) && (
          <Text fontWeight="700" fontSize="12px" color="#ec6363" mr={2}>
            NOT FOUND
          </Text>
        )}
        <SearchBox
          placeholder="Search"
          value={props.search}
          onChange={props.onSearch}
        />
        <Box ml={2} style={{ position: 'relative' }}>
          <FilterButton onClick={props.toggleShowFilter}>
            Filter (
            {(props.activeFilter.REPORT ? 1 : 0) +
              (props.activeFilter.BROADCAST ? 1 : 0)}
            ) <Image ml={1} src={FilterSrc} width="14px" />
          </FilterButton>

          <ClickOutSide
            onClickOutside={() =>
              props.showFilter && props.toggleShowFilter(false)
            }
          >
            <SelectionContainer show={props.showFilter}>
              <Text fontSize="12px" color="#393939" fontWeight="900" ml={1}>
                FILTER
              </Text>
              <Flex
                width="100%"
                bg="#e7ecff"
                my="8px"
                style={{ height: '2px' }}
              />
              <Choice
                selected={
                  !props.activeFilter.REPORT && !props.activeFilter.BROADCAST
                }
                onClick={() =>
                  props.onSetFilter(
                    'ALL',
                    !(
                      !props.activeFilter.REPORT &&
                      !props.activeFilter.BROADCAST
                    ),
                  )
                }
              >
                All
              </Choice>
              <Choice
                selected={props.activeFilter.REPORT}
                onClick={() =>
                  props.onSetFilter('REPORT', !props.activeFilter.REPORT)
                }
              >
                Reported
              </Choice>
              <Choice
                selected={props.activeFilter.BROADCAST}
                onClick={() =>
                  props.onSetFilter('BROADCAST', !props.activeFilter.BROADCAST)
                }
              >
                Broadcasted
              </Choice>
            </SelectionContainer>
          </ClickOutSide>
        </Box>
      </Flex>
      <Box mt={2}>
        <LogFetcher
          tcd={props.tcdAddress}
          page={props.currentPage}
          type={
            props.activeFilter.REPORT
              ? 'REPORT'
              : props.activeFilter.BROADCAST
              ? 'BROADCAST'
              : undefined
          }
          actor={
            props.query
              ? searchProviderAddress(props.query) || undefined
              : undefined
          }
        >
          {({ fetching, data }) =>
            fetching ? (
              'Loading ...'
            ) : (
              <RenderLogs data={data} symbol={props.symbol} />
            )
          }
        </LogFetcher>

        <Box mt={2}>
          <PaginationRender
            currentPage={props.currentPage}
            numberOfPages={props.numberOfPages}
            onChangePage={props.onChangePage}
          />
        </Box>
      </Box>
    </Card>
  </PageStructure>
)
