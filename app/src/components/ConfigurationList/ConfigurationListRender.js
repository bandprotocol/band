import React from 'react'
import styled from 'styled-components'
import { Flex, Button, Image, H3 } from 'ui/common'
import { NavLink } from 'react-router-dom'
import ParameterCard from 'components/ParameterCard'
import EditPropose from 'images/edit-proposal.svg'
import { getParameterDetail } from 'utils/helper'

const CustomButton = styled(Button).attrs({
  variant: 'gradientBlue',
})`
  font-size: 13px;
  font-weight: 700;
  display: inline-block;
  height: 34px;
  padding: 0 18px 2px;
  align-self: flex-end;
  margin-bottom: 2px;
`

export default ({ params, communityAddress, linkToParameter }) => (
  <Flex
    flexDirection="column"
    mt="30px"
    bg="white"
    p="25px"
    style={{
      borderRadius: '10px',
      boxShadow: '0 2px 9px 4px rgba(0, 0, 0, 0.04)',
    }}
  >
    <Flex flexDirection="row" alignItems="center" mx="11px">
      <H3 color="#4a4a4a">Configurations</H3>
      <Flex width={1} justifyContent="flex-end">
        <NavLink
          to={linkToParameter}
          style={{
            textDecoration: 'none',
            color: 'white',
            lineHeight: '1.4em',
            alignSelf: 'flex-end',
            padding: '0 18px 2px',
          }}
        >
          <CustomButton>
            <Flex
              flexDirection="row"
              justifyContent="center"
              alignItems="center"
              style={{ fontFamily: 'bio-sans' }}
            >
              <Image src={EditPropose} height="18px" mr={2} />
              Propose Change
            </Flex>
          </CustomButton>
        </NavLink>
      </Flex>
    </Flex>
    <Flex flexWrap="wrap" mt="12px">
      {params.map(param => (
        <ParameterCard
          {...param}
          key={param.name}
          detail={getParameterDetail(param.name)}
          isEdit={false}
          padding="17px 23px 19px 19px"
          margin="0px 20px 17px 0px"
          width="346px"
          whiteCardStyle={{ maxWidth: 'calc(33.33% - 20px)' }}
        />
      ))}
    </Flex>
  </Flex>
)
