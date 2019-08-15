import React from 'react'
import styled from 'styled-components'
import { Box, Flex, Card, Text, AbsoluteLink, Button, Image } from 'ui/common'
import WebRequestUpload from 'images/web-request-upload.png'
import RightArrowSrc from 'images/icon-right-arrow.svg'
import { copy } from 'utils/clipboard'

const Container = styled.div`
  width: 100%;
  margin: 0 auto 20px auto;
`

export default ({ onNext, isUploading, ipfsPath }) => (
  <Container>
    <Flex flexDirection="column" alignItems="center" justifyContent="center">
      <Image src={WebRequestUpload} width="85px" />
      {isUploading ? (
        <Text fontSize="14px" mt={3}>
          Uploading Endpoint JSON to IPFS
        </Text>
      ) : (
        <Flex flexDirection="column" alignItems="center">
          <Text fontSize="14px" mt={3}>
            Congratulations! You have sucessfully setup a new endpoint.
          </Text>
          <Flex
            bg="#fafbff"
            mt="20px"
            justifyContent="space-between"
            alignItems="center"
            p="8px 15px 8px 10px"
            style={{ borderRadius: '17.5px', height: '35px' }}
          >
            <Flex
              justifyContent="center"
              alignItems="center"
              color="#fff"
              bg="#ffca55"
              width="47px"
              fontSize="12px"
              style={{ height: '20px', borderRadius: '10px' }}
            >
              IPFS
            </Flex>
            <Text
              fontSize="13px"
              color="#4a4a4a"
              ml="10px"
              flex={1}
              style={{
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
              }}
            >
              {ipfsPath}
            </Text>
            <CopiedKey keyOnChain={ipfsPath} />
          </Flex>
        </Flex>
      )}
    </Flex>

    <Box style={{ borderBottom: 'solid 1px #E8E9F8' }} py={3} />

    <Flex mt={4} justifyContent="center">
      <Button variant="gradient" onClick={onNext}>
        MAKE A QUERY
        <Image ml={3} height="0.8em" src={RightArrowSrc} />
      </Button>
    </Flex>
  </Container>
)

class CopiedKey extends React.Component {
  state = {
    copied: false,
  }

  handleShowCopied(e) {
    copy(this.props.keyOnChain)
    this.setState(
      {
        copied: true,
      },
      () => {
        setTimeout(
          () =>
            this.setState({
              copied: false,
            }),
          500,
        )
      },
    )
    e.stopPropagation()
  }

  render() {
    return (
      <Text
        textAlign="right"
        color="#5269ff"
        fontWeight={500}
        width="80px"
        fontSize="13px"
        ml="5px"
        onClick={this.handleShowCopied.bind(this)}
        style={{ cursor: 'pointer' }}
      >
        {this.state.copied ? 'Copied' : 'Click to copy'}
      </Text>
    )
  }
}
