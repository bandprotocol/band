import React from 'react'
import { Flex, Text, Button, Image } from 'ui/common'
import styled from 'styled-components'
import RightArrowSrc from 'images/icon-right-arrow.svg'
import { TwitterShareButton } from 'react-share'

const Message = styled.textarea`
  width: 100%;
  heigth: 100%;
  min-height: 100px;
  font-size: 14px;
  margin: 10px 0px;
  padding: 9px 13px 10px;
  border-radius: 4px;
  box-shadow: 0 4px 20px 0 #f4f4f4;
  border: solid 1px #e5e6f5;
  background-color: #ffffff;
  resize: none;
`

const NextButton = styled(Button).attrs({
  width: '200px',
  height: '40px',
  mt: '5px',
})`
  line-height: 30px;
  cursor: pointer;
  background-image: linear-gradient(281deg, #968cff, #8998ff);

  & .next-arrow {
    transition: all 500ms;
  }

  &:hover {
    & .next-arrow {
      transform: translateX(40px);
    }
  }
`

export default ({ onShareWindowClose, address }) => {
  const title = `I'm applying for Band Identity with address: ${address} Join me at`
  return (
    <React.Fragment>
      <Flex width="65%" flexDirection="column" mt="30px">
        <Text color="#4a4a4a" fontSize="14px" fontWeight="500">
          Tweet this message on your public twitter
        </Text>
        <Message
          value={`${title} https://data.bandprotocol.com/dataset/identity`}
        />
        <Flex justifyContent="center">
          <TwitterShareButton
            url="https://data.bandprotocol.com/dataset/identity"
            title={title}
            style={{ outline: 'none' }}
            hashtags={['BandIdentity']}
            onShareWindowClose={() => onShareWindowClose()}
          >
            <NextButton>
              <Flex
                flexDirection="row"
                justifyContent="flex-start"
                width="100%"
              >
                <Text mr={2}>Click to tweet</Text>
                <Image src={RightArrowSrc} className="next-arrow" />
              </Flex>
            </NextButton>
          </TwitterShareButton>
        </Flex>
      </Flex>
    </React.Fragment>
  )
}
