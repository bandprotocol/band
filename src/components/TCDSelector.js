import React from 'react'
import styled from 'styled-components'
import { Flex, Image, Text } from 'ui/common'
import TCDActive from 'images/tcdActive.svg'
import TCDInactive from 'images/tcdInactive.svg'
import Triangle from 'images/triangle.svg'

// Mock
import BasketballSrc from 'images/basketball.svg'

const SelectionContainer = styled(Flex).attrs({
  bg: '#fff',
  flexDirection: 'column',
})`
  position: absolute;
  left: 230px;
  padding: 15px;
  width: 260px;
  height: 330px;
  z-index: 1;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  ${p => (p.show ? `display: block;` : `display: hidden;`)}
`

const SelectionList = styled(Flex).attrs({
  bg: '#fff',
  alignItems: 'center',
})`
  cursor: pointer;
  height: 60px;
  border-radius: 3px;

  &: hover {
    background: #f2f5ff;
  }
`

const CurrentCard = styled(Flex)`
  color: #ffffff;
  text-decoration: none;
  font-size: 14px;
  width: 100%;
  padding: 3px 5px 2px 5px;
  cursor: pointer;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  & .tab {
    margin-top: 2px;
    color: #ffffff;
    border-radius: 28px;
    width: 100%;
  }

  ${p =>
    p.active
      ? `
    font-weight: 700;

    & .tab {
      opacity: 1;
      color: #fff;
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.16);
      background-image: linear-gradient(
        257deg,
        rgba(255, 255, 255, 0.8),
        rgba(255, 255, 255, 0.9) 100%
      );
    }

    & .img-active {
      display: block;
    }

    & .img-inactive {
      display: none;
    }
  
  `
      : `
      & .img-active {
        display: none;
      }
    
      & .img-inactive {
        display: block;
      }
      `}

  &:hover {
    :not(.is-active) {
      & .tab {
        background-image: linear-gradient(
          257deg,
          rgba(255, 255, 255, 0.1),
          rgba(255, 255, 255, 0.2) 100%
        );
      }
    }
  }
`

const List = ({ image, label, datapoints }) => (
  <SelectionList>
    <Image src={image} />
    <Flex flexDirection="column" ml="14px">
      <Text fontSize="14px" fontWeight="900" color="#3b57d1">
        {label}
      </Text>
      <Text my={1} fontSize="10px" color="#a4b0e4" fontWeight="900">
        {datapoints} datapoints
      </Text>
    </Flex>
  </SelectionList>
)

const options = [
  {
    image: BasketballSrc,
    label: 'Soccer',
    datapoints: 20,
    path: 'soccer',
  },
  {
    image: BasketballSrc,
    label: 'Basketball',
    datapoints: 12,
    path: 'basketball',
  },
]

export default class TCDSelector extends React.Component {
  state = {
    show: false,
    currentOption: options[0],
  }

  handleSelect() {}

  render() {
    // const { options } = this.props
    const { currentOption } = this.state
    return (
      <Flex style={{ position: 'relative' }}>
        {/* Current TCD */}
        <CurrentCard>
          <Flex width="100%" style={{ height: '52px' }}>
            <Flex
              flex={1}
              flexDirection="row"
              alignItems="center"
              className="tab"
              justifyContent="space-between"
              pl={4}
              pr={3}
            >
              <Flex alignItems="center">
                <Image
                  src={TCDActive}
                  className="img-active"
                  width="20px"
                  height="20px"
                />
                <Image
                  src={TCDInactive}
                  className="img-inactive"
                  width="20px"
                  height="20px"
                />
                <Text px={3}>{currentOption.label}</Text>
              </Flex>
              <Image src={Triangle} />
            </Flex>
          </Flex>
        </CurrentCard>
        {/* <SelectionContainer show={this.state.show}>
          <Text fontSize="12px" color="#393939" fontWeight="900" ml={1}>
            SELECT FROM AVAILABLE DATA
          </Text>
          <Flex width="100%" bg="#e7ecff" my="8px" style={{ height: '2px' }} />
          {options.map(({ image, label, datapoints, path }) => (
            <List image={image} datapoints={datapoints} label={label} />
          ))}
        </SelectionContainer> */}
      </Flex>
    )
  }
}
