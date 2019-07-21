import React from 'react'
import styled from 'styled-components'
import { Box, Flex, Card, Text, AbsoluteLink, Button, Image } from 'ui/common'
import WebRequestUpload from 'images/web-request-upload.png'

const Container = styled.div`
  width: 100%;
  margin: 0 auto 30px auto;
`

export default ({ onNext }) => (
  <Container>
    <Flex flexDirection="column" alignItems="center" justifyContent="center">
      <Image src={WebRequestUpload} width="85px" />
      <Text fontSize="14px" mt={3}>
        Uploading Endpoint JSON to IPFS
      </Text>
    </Flex>

    <Box style={{ borderBottom: 'solid 1px #E8E9F8' }} py={3} />

    <Flex mt={4} justifyContent="center">
      <Button variant="gradient" onClick={onNext}>
        DONE
      </Button>
    </Flex>
  </Container>
)
