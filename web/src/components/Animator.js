import React from 'react'
import { Flex, Text, Image, Box } from 'ui/common'
import { isMobile } from 'ui/media'

export default class Animator extends React.Component {
  constructor(props) {
    super(props)
    this.container = React.createRef()
  }

  render() {
    const { step, title, steps, spites } = this.props

    return (
      <React.Fragment>
        <div ref={this.container}>
          <Flex>
            <AnimationScene currentStep={step} spites={spites} />
          </Flex>
        </div>
      </React.Fragment>
    )
  }
}

export class AnimationScene extends React.Component {
  getStyle(steps) {
    const { currentStep } = this.props
    const [opacity = 0, x, y, delay = 0, scale = 1] =
      steps[currentStep >= 0 ? currentStep : 0] || Array(10).fill(0)

    return {
      opacity,
      transitionDelay: `${delay}ms`,
      transform: `translate(${x}px, ${y}px) scale(${scale})`,
    }
  }

  render() {
    const { spites } = this.props

    return (
      <Box
        style={{
          width: 500,
          height: 500,
          zIndex: 2,
        }}
      >
        {spites.map(({ src, height, width, steps, style = {} }, i) => (
          <Image
            key={i}
            src={src}
            height={height}
            width={width}
            style={{
              transition: 'all 300ms',
              position: 'absolute',
              top: 0,
              left: 0,
              ...style,
              ...this.getStyle(steps),
            }}
          />
        ))}
      </Box>
    )
  }
}
