import React from 'react'
import bandLogoSrc from 'images/band.svg'
import { Flex, Image, Text } from 'rebass'

export default () => (
  <Flex
    alignItems="center"
    style={{
      margin: '16vh 20px',
      flexDirection: 'column',
      textAlign: 'center',
      fontSize: '18px',
      lineHeight: '20px',
    }}
  >
    <Image
      src={bandLogoSrc}
      width="100px"
      style={{ marginBottom: '20px' }}
      alt="band logo"
    />
    <Text>
      Band Governance Portal is currently not supported on mobile platforms.
    </Text>

    <Text>
      You can use desktop browsers to interact with Governance Portal.
    </Text>

    <Text mt="50px">Please visit</Text>
    <a href="https://bandprotocol.com">https://bandprotocol.com</a>
    <Text>to learn more about Band Protocol.</Text>
  </Flex>
)
