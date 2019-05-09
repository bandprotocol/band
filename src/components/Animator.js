import React, { useState } from 'react'
import PageContainer from 'components/PageContainer'
import { Flex, Text, Image, Box } from 'ui/common'
import { isMobile } from 'ui/media'

export default class Animator extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentStep: -1,
    }
    this.container = React.createRef()
    this.onScroll = this.onScroll.bind(this)
  }

  componentDidMount() {
    window.document.body.addEventListener('scroll', this.onScroll)
  }

  componentWillUnmount() {
    window.document.body.removeEventListener('scroll', this.onScroll)
  }

  onScroll() {
    const diff = this.container.current.getBoundingClientRect().top - 400
    const step = diff < 0 ? Math.floor(Math.abs(diff) / 500) : -1
    if (this.state.currentStep !== step && step < 4) {
      this.setState({ currentStep: step })
    }
  }

  render() {
    const { title, steps, spites } = this.props

    return (
      <React.Fragment>
        <Flex
          mt={4}
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          style={{
            height: 240,
            background: '#ffffff',
            position: 'sticky',
            top: 0,
            width: '100%',
          }}
        >
          <Text
            textAlign="center"
            fontSize={['24px', '38px']}
            mt="32px"
            lineHeight="48px"
            fontWeight={900}
            color="#2a304e"
          >
            {title}
          </Text>
          <Flex
            style={{
              height: '160px',
              width: 960,
              zIndex: 3,
              background:
                'linear-gradient(to bottom, white 80%, rgba(255,255,255,0.1) 100%)',
            }}
            pb={3}
            alignItems="center"
            justifyContent="space-between"
          >
            {steps.map(({ src, srcActive }, i) => (
              <Box key={i} flex="1">
                <Image
                  src={this.state.currentStep === i ? srcActive : src}
                  height="70px"
                />
              </Box>
            ))}
          </Flex>
        </Flex>
        <div ref={this.container} style={{ width: 960, marginBottom: -500 }}>
          <Flex>
            <AnimationScene
              currentStep={this.state.currentStep}
              spites={spites}
            />
            <Box style={{ width: 500 }}>
              {steps.map(({ renderText }, i) => (
                <Flex
                  alignItems="center"
                  justifyContent="flex-end"
                  style={{
                    height: '500px',
                    width: '100%',
                  }}
                >
                  <Text fontSize="20px" lineHeight="2" mr="24px">
                    {renderText()}
                  </Text>
                </Flex>
              ))}
            </Box>
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
        mr={4}
        style={{
          width: 500,
          height: 500,
          position: 'relative',
          position: 'sticky',
          top: '240px',
          // border: 'solid 1px #ccc',
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
