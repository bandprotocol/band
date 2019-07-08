import React from 'react'
import styled from 'styled-components'
import { Flex, Text, Card } from 'ui/common'
import colors from 'ui/colors'
import AutoDate from 'components/AutoDate'
import { copy } from 'utils/clipboard'

const DataPointContainer = styled(Card).attrs(p => ({
  variant: 'list',
  borderRadius: 10,
  p: 0,
}))`
  width: 100%;
  transition: all 250ms;
  cursor: pointer;
  background-color: #fff;
  border: solid 1px #e7ecff;
  &:hover {
    box-shadow: ${colors.shadow.lightActive};
  }

  ${p =>
    !p.expand &&
    `
    overflow: hidden;
  `}
`

const ExpandableCard = styled(Card)`
  max-height: 0;
  opacity: 0;

  ${p =>
    p.expand &&
    `
    transition: max-height 1500ms ease-out, opacity 500ms;
    max-height: 1000px;
    opacity: 1;
  `}
`

const KeyBox = styled(Flex)`
  background-color: #fafbff;
  padding: 0px 10px;
  border-radius: 18px;
  min-width: 450px;
  min-height: 36px;
  transition: all 200ms;
  border: solid 1px #e7ecff;
  &:hover {
    border: solid 1px #d7dfff;
  }
`

export default class DataPoint extends React.Component {
  state = { expand: false, copied: false }

  handleShowCopied(e, keyOnChain) {
    copy(keyOnChain)
    this.setState(
      {
        copied: true,
      },
      () => {
        setTimeout(
          () =>
            this.setState({
              copied: false,
            }),
          500,
        )
      },
    )
    e.stopPropagation()
  }

  render() {
    const {
      children,
      label,
      k,
      v,
      updatedAt,
      keyOnChain,
      Logo = () => <div />,
    } = this.props
    return (
      <DataPointContainer expand={this.state.expand} mb="12px">
        <Flex
          onClick={() => this.setState({ expand: !this.state.expand })}
          pl="60px"
          pr="30px"
          alignItems="center"
          style={{ height: '60px', overflow: 'hidden' }}
        >
          <Flex flex="0 0 160px" alignItems="center">
            <Text
              fontFamily="code"
              fontSize={14}
              fontWeight={900}
              color="#506fff"
            >
              <AutoDate>{updatedAt}</AutoDate>
            </Text>
          </Flex>
          <Flex flexDirection="row" className="label">
            <Logo />
            <Text fontFamily="code" fontSize={15} fontWeight="700">
              {label && {}.toString.call(label) === '[object Function]'
                ? label()
                : label}
            </Text>
          </Flex>
          <Flex flex={1} justifyContent="flex-end">
            {v()}
            {this.state.expand ? (
              <Flex mx="20px" alignItems="center">
                <i className="fas fa-chevron-up" />
              </Flex>
            ) : (
              <Flex mx="20px" alignItems="center">
                <i className="fas fa-chevron-down" />
              </Flex>
            )}
          </Flex>
        </Flex>
        {children && (
          <ExpandableCard expand={this.state.expand}>
            {this.state.expand && children}
            <Flex justifyContent="center" alignItems="center" bg="white">
              <Flex
                mt="10px"
                style={{
                  height: '10px',
                  width: '450px',
                  borderTop: 'solid 1px #e7ecff',
                }}
              />
            </Flex>
            <Flex
              pt="10px"
              pb="20px"
              justifyContent="center"
              alignItems="center"
            >
              <KeyBox
                justifyContent="center"
                alignItems="center"
                onClick={e => this.handleShowCopied(e, keyOnChain)}
              >
                <Flex
                  bg="#ffca55"
                  justifyContent="center"
                  alignItems="center"
                  style={{
                    fontWeight: 500,
                    maxWidth: '50px',
                    minWidth: '50px',
                    maxHeight: '20px',
                    minHeight: '20px',
                    borderRadius: '10px',
                  }}
                >
                  <Text color="#ffffff" fontWeight="900" fontSize="12px">
                    KEY
                  </Text>
                </Flex>
                <Text
                  fontFamily="code"
                  fontWeight="500"
                  color="#4a4a4a"
                  fontSize="14px"
                  ml="10px"
                  mr="auto"
                >
                  {keyOnChain}
                </Text>
                <Text mr={2} color="#5269ff" fontWeight={500} fontSize="13px">
                  {this.state.copied ? 'Copied' : 'Click to copy'}
                </Text>
              </KeyBox>
            </Flex>
          </ExpandableCard>
        )}
      </DataPointContainer>
    )
  }
}
