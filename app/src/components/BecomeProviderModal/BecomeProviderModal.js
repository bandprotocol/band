import { connect } from 'react-redux'
import React from 'react'
import styled from 'styled-components'
import { hideModal } from 'actions'
import { Flex, Text } from 'ui/common'
import colors from 'ui/colors'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

const BgCard = styled(Flex).attrs({
  bg: 'white',
  flexDirection: 'column',
})`
  width: 400px;
  height: 160px;
  border-radius: 6px;
  box-shadow: 0 12px 23px 0 rgba(0, 0, 0, 0.13);
`

const BecomeProviderModal = ({ hideBeProvider }) => {
  return (
    <BgCard mt="100px">
      <Flex
        style={{
          height: '55px',
          borderBottom: '1px solid #ededed',
        }}
        pl="30px"
        alignItems="center"
      >
        <Flex width={[1 / 2]}>
          <Text
            color={colors.blue.dark}
            fontFamily="Avenir-Heavy"
            fontSize="14px"
          >
            Become a provider
          </Text>
        </Flex>
        <Flex width={[1 / 2]} mr="20px" justifyContent="flex-end">
          <Text
            fontWeight={100}
            fontFamily="Avenir-Medium"
            fontSize="14px"
            style={{ cursor: 'pointer' }}
            onClick={() => hideBeProvider()}
          >
            <FontAwesomeIcon icon={faTimes} />
          </Text>
        </Flex>
      </Flex>
      <Flex pt="20px" px="30px" flexDirection="column">
        <Text color="#4a4a4a" fontSize="14px" lineHeight={1.43}>
          Please contact: contact@bandprotocol.com
        </Text>
      </Flex>
    </BgCard>
  )
}

const mapDispatchToProps = (dispatch, props) => ({
  hideBeProvider: () => dispatch(hideModal()),
})

export default connect(
  null,
  mapDispatchToProps,
)(BecomeProviderModal)
