import React from 'react'
import styled from 'styled-components'
import { Box, Text, Flex, Image } from 'rebass'
import TooltipIcon from 'images/icon-reason.svg'
import TooltipHoverIcon from 'images/tooltip-hover.svg'

const PopupBox = styled(Box)`
  z-index: 1000000000;
  position: absolute;
  ${p => (p.left ? `left: ${-p.left}px` : `right: ${p.right}px`)};
  ${p => (p.top ? `bottom: ${p.top}px` : `top: ${p.bottom}px`)};
  border: ${p => `1px solid ${p.bg || '#cbcfe3'}`};
  box-shadow: 0 14px 18px 0 rgba(0, 0, 0, 0.07);
  width: ${p => p.width || 250}px;
  font-size: 14px;
  line-height: 1.5;
  border-radius: 8px;
  color: #7c84a6;
  transition: all 250ms;
  ${p =>
    p.show
      ? `
    opacity: 1;
    transform: translateY(10px);
  `
      : `
    opacity: 0;
    transform: translateY(0);
    pointer-events: none;
  `}
  &:before {
    position: absolute;
    ${p => (p.top ? `bottom: -8px` : `top: -8px`)};
    left: ${p => p.tipLeft || 5}px;
    content: '';
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: ${p => p.top && `8px solid ${p.bg || '#cbcfe3'}`};
    border-bottom: ${p => p.bottom && `8px solid ${p.bg || '#cbcfe3'}`};
  }
  &:after {
    position: absolute;
    ${p => (p.top ? `bottom: -6.5px` : `top: -6.5px`)};
    left: ${p => p.tipLeft || 5}px;
    content: '';
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: ${p => p.top && `8px solid ${p.bg || '#ffffff'}`};
    border-bottom: ${p => p.bottom && `8px solid ${p.bg || '#ffffff'}`};
  }
`

export default class Tooltip extends React.Component {
  state = {
    show: false,
  }
  render() {
    const {
      top,
      bottom,
      left,
      right,
      tip,
      width,
      textBg,
      textColor,
      children,
      size,
    } = this.props
    return (
      <Flex
        alignItems="center"
        style={{
          cursor: 'pointer',
          position: 'relative',
          display: 'inline-block',
        }}
      >
        <Image
          src={this.state.show ? TooltipHoverIcon : TooltipIcon}
          width={size || '20px'}
          height={size || '20px'}
          onMouseLeave={() =>
            this.setState({
              show: false,
            })
          }
          onMouseEnter={() =>
            this.setState({
              show: true,
            })
          }
        />
        <PopupBox
          show={this.state.show}
          width={width}
          top={top}
          bottom={bottom}
          left={left}
          right={right}
          tipLeft={tip && tip.left}
          bg={textBg}
          p={2}
        >
          <Text
            fontSize="12px"
            lineHeight="19px"
            py={2}
            px={2}
            bg={textBg}
            color={textColor}
            textAlign="left"
          >
            {children}
          </Text>
        </PopupBox>
      </Flex>
    )
  }
}
