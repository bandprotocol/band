import React from 'react'
import { BackgroundCard, Image, Flex, Button, Text, Card } from 'ui/common'
import { colors } from 'ui'

// Images
import LogoSrc from 'images/loginLogo.png'
import BackgroundSrc from 'images/loginBG.svg'

const login = async hideLogin => {
  if (typeof window.ethereum !== 'undefined') {
    await window.ethereum.enable() // TODO: put it to band.js
    hideLogin()
  }
}

const openMetaMask = () => {
  window.open('https://metamask.io/', '_blank')
}

export default props => {
  const { hideLogin, showWallet } = props
  console.log('debug', props)
  return (
    <Card variant="modal">
      <Flex
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        py={1}
        mb={3}
      >
        <BackgroundCard
          width="487px"
          style={{ height: '288px' }}
          mt="-20px"
          ml="-10px"
          mr="-10px"
          bgImage={BackgroundSrc}
        >
          <Flex
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
          >
            <Image src={LogoSrc} width="332px" mt="90px" />
          </Flex>
        </BackgroundCard>
        <Flex
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <Button
            width="345px"
            variant="primary"
            style={{ height: '55px' }}
            onClick={() => login(hideLogin)}
            my={1}
          >
            <Text color={colors.white} fontSize={1}>
              Connect via MetaMask
            </Text>
          </Button>
          <Button
            width="345px"
            variant="outline"
            style={{ height: '55px', backgroundColor: '#f2f5ff' }}
            my={3}
            onClick={showWallet}
          >
            <Text color={colors.purple.normal} fontSize={1}>
              Connect via BandWallet
            </Text>
          </Button>
        </Flex>
      </Flex>
    </Card>
  )
}
