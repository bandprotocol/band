import React from 'react'
import styled from 'styled-components'
import { Box, Button as BaseButton } from 'rebass'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

const Spinner = styled(Box)`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`

export function createLoadingButton(Component) {
  class CustomButton extends Button {
    static Component = Component
  }
  return CustomButton
}

export default class Button extends React.Component {
  static Component = BaseButton

  state = {
    isLoading: false,
  }

  async onClick(e) {
    e.stopPropagation()

    const { onClick } = this.props

    if (onClick && !this.state.isLoading) {
      // Start loading
      this.setState({ isLoading: true })

      // Call onClick
      const maybePromise = onClick()

      // Wait until the (maybe) Promise is done
      try {
        await Promise.resolve(maybePromise)
      } catch (e) {}

      // Then go back to the initial state
      this.setState({ isLoading: false })
    }
  }

  render() {
    const { Component } = this.constructor
    const { children, onClick, style = {}, ...props } = this.props
    const { isLoading } = this.state
    return (
      <Component
        onClick={this.onClick.bind(this)}
        style={{ position: 'relative', ...style }}
        {...props}
      >
        {isLoading && (
          <Spinner>
            <FontAwesomeIcon icon={faSpinner} spin />
          </Spinner>
        )}
        <Box style={{ opacity: isLoading ? 0 : 1 }}>{children}</Box>
      </Component>
    )
  }
}
