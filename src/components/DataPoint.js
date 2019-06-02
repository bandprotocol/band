import React from 'react'
import styled from 'styled-components'
import { Flex, Box, Text, Card, Image, Button, Heading } from 'ui/common'
import colors from 'ui/colors'
import AutoDate from 'components/AutoDate'
import KeySnippet from 'components/KeySnippet'

const DataPointContainer = styled(Card).attrs(p => ({
  variant: 'list',
  borderRadius: 10,
  p: 0,
}))`
  width: 100%;
  transition: all 250ms;
  cursor: pointer;
  overflow: hidden;

  &:hover {
    box-shadow: ${colors.shadow.lightActive};
  }
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

const MagicBox = styled(Box)`
  flex: 1;
  line-height: 30px;
  margin-right: 10px;
  position: relative;
  height: 60px;

  .key-snippet {
    position: absolute;
    top: 10px;
    opacity: 0;
    transition: all 150ms;
    z-index: 1;
    background: #ffffff;
  }

  .label {
    position: absolute;
    top: 0;
    opacity: 1;
    line-height: 60px;
  }

  &:hover {
    .key-snippet {
      opacity: 1;
    }

    .label {
      opacity: 0;
    }
  }
`

export default class DataPoint extends React.Component {
  state = { expand: false }

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
      <DataPointContainer mb="20px">
        <Flex
          onClick={() => this.setState({ expand: !this.state.expand })}
          px="18px"
          alignItems="center"
          style={{ height: '60px', overflow: 'hidden' }}
        >
          <Flex flex="0 0 130px" alignItems="center">
            <Text fontFamily="code" fontSize={13} color="light">
              <AutoDate>{updatedAt}</AutoDate>
            </Text>
          </Flex>
          <MagicBox>
            <Box className="key-snippet">
              <KeySnippet keyOnChain={keyOnChain} />
            </Box>
            <Flex flexDirection="row" className="label">
              <Logo />
              <Text fontFamily="code" fontSize={15} fontWeight="700">
                {label}
              </Text>
            </Flex>
          </MagicBox>
          {v()}
        </Flex>
        {children && (
          <ExpandableCard
            borderTop="solid 1px #EDEDED"
            expand={this.state.expand}
          >
            {this.state.expand && children}
          </ExpandableCard>
        )}
      </DataPointContainer>
    )
  }
}
