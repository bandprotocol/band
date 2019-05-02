import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { Flex, Button, Text, Card } from 'ui/common'

import { communityDetailSelector } from 'selectors/communities'
import { currentCommunityClientSelector } from 'selectors/current'
import BN from 'utils/bignumber'
import { Utils } from 'band.js'
import { isPositiveNumber } from 'utils/helper'

const BgCard = styled(Flex).attrs({
  bg: 'white',
  flexDirection: 'column',
})`
  width: 400px;
  height: 281px;
  border-radius: 6px;
  box-shadow: 0 12px 23px 0 rgba(0, 0, 0, 0.13);
`

const CustomButton = styled(Button).attrs({
  fontSize: '16px',
  fontWeight: 500,
  bg: '#7c84a6',
  width: '120px',
})`
  border-radius: 6px;
  transition: 0.5s all;
  cursor: pointer;
  &:hover {
    box-shadow: 0 3px 5px 0 rgba(180, 187, 218, 0.5);
  }

  &:active {
    background-color: #626b90;
    box-shadow: 0 0px 0px 0;
  }
`

const Input = styled.input`
  width: 341px;
  height: 35px;
  border-radius: 3px;
  border: solid 1px #e7ecff;
  padding: 0px 10px;
`

class DWModal extends React.Component {
  state = {
    value: '',
  }

  componentDidMount() {
    this.setState({ type: this.props.type })
  }

  render() {
    const { symbol, actionType } = this.props
    return (
      <BgCard mt="100px">
        <Flex
          style={{ height: '55px', borderBottom: '1px solid #ededed' }}
          pl="30px"
          alignItems="center"
        >
          <Text color="#4e3ca9" fontFamily="Avenir-Heavy" fontSize="14px">
            {actionType[0] + actionType.slice(1).toLowerCase()}
          </Text>
        </Flex>
        <Flex pt="20px" px="30px" flexDirection="column">
          <Text color="#4a4a4a" fontSize="14px" lineHeight={1.43}>
            Spicy jalapeno bacon ipsum dolor amet sirloin strip steak
            venisonalcatra cupim pork belly sausage bacon andouille Meatloaf
            turkey tenderloin ground
          </Text>
          <Flex my="30px">
            <Flex style={{ position: 'absolute', right: '50px' }}>
              <Text
                lineHeight="35px"
                color="#cbcfe3"
                fontFamily="Avenir-Medium"
              >
                {symbol}
              </Text>
            </Flex>
            <Input
              value={this.state.value}
              onChange={({ target }) => this.setState({ value: target.value })}
            />
          </Flex>
          <Flex width={1} justifyContent="center">
            <CustomButton>Submit</CustomButton>
          </Flex>
        </Flex>
      </BgCard>
    )
  }
}

const mapStateToProps = (state, { type, communityAddress }) => {
  const community = communityDetailSelector(state, {
    address: communityAddress,
  })
  if (!community) return {}
  return {
    communityAddress,
    symbol: community.get('symbol'),
  }
}

const mapDispatchToProps = (dispatch, { communityAddress }) => ({})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DWModal)
