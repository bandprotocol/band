import React from 'react'
import styled from 'styled-components'
import { Flex, Text, Button, Image } from 'ui/common'
import { NavLink } from 'react-router-dom'
import ParameterCard from 'components/ParameterCard'
import EditPropose from 'images/edit-proposal.svg'
import { getParameterDetail } from 'utils/helper'

const CustomButton = styled(Button).attrs({
  variant: 'blue',
})`
  cursor: pointer;
  font-size: 15px;
  font-weight: 700;
  padding: 9px 17px;
`

export default ({ params, communityAddress }) => (
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
    <Flex flexDirection="row" alignItems="center">
      <Text fontWeight="700" fontSize="20px">
        Configurations
      </Text>
      <Flex width={1} justifyContent="flex-end">
        <CustomButton>
          <NavLink
            to={`/community/${communityAddress}/parameters`}
            style={{
              textDecoration: 'none',
              color: 'white',
              lineHeight: '1.4em',
            }}
          >
            <Flex
              flexDirection="row"
              justifyContent="center"
              alignItems="center"
            >
              <Image src={EditPropose} />
              <Text ml="10px" fontSize="16px" font-weight="500">
                Propose Change
              </Text>
            </Flex>
          </NavLink>
        </CustomButton>
      </Flex>
    </Flex>
    <Flex flexWrap="wrap" mt="28px">
      {params.map(param => (
        <ParameterCard
          {...param}
          key={param.name}
          detail={getParameterDetail(param.name)}
          isEdit={false}
          padding="17px 23px 19px 19px"
          margin="0px 20px 17px 0px"
          width="346px"
        />
      ))}
    </Flex>
  </Flex>
)
