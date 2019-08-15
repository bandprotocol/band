import React from 'react'
import { Flex, Button, Image, Text } from 'ui/common'
import styled from 'styled-components'
import RightArrowSrc from 'images/icon-right-arrow.svg'

const Input = styled.input`
  width: 90%;
  line-height: 36px;
  border-radius: 4px;
  border: 1px solid #e5e6f5;
  font-size: 16px;
  padding-left: 10px;
  margin: 10px 0px;
  box-shadow: 0 4px 20px 0 #f4f4f4;

  &:placeholder {
    font-size: 16px;
  }
`

const NextButton = styled(Button).attrs({
  width: '130px',
  height: '40px',
  mt: '18px',
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

export default ({ link, handleLink, submitLink }) => (
  <React.Fragment>
    <Flex flexDirection="column" alignItems="center" width="100%" my="30px">
      <Text fontSize="14px" fontWeight="500" color="#4a4a4a" my={1}>
        Place your shared link here.
      </Text>
      <Input
        name="link"
        placeholder="https://twitter.com/......."
        value={link}
        onChange={handleLink}
      />
      <NextButton onClick={submitLink}>
        <Flex flexDirection="row" justifyContent="flex-start" width="100%">
          <Text mr={2}>Next</Text>
          <Image src={RightArrowSrc} className="next-arrow" />
        </Flex>
      </NextButton>
    </Flex>
  </React.Fragment>
)
