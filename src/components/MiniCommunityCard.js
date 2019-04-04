import React from 'react'
import styled from 'styled-components'
import { colors } from 'ui'
import { Flex, Text, AbsoluteLink, Image } from 'ui/common'
import OutImg from 'images/out.svg'

const MiniCard = styled(Flex).attrs({
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'center',
  mx: '5px',
})`
  cursor: pointer;
  background-color: #f6f7fc;
  width: 370px;
  height: 105px;
  border-radius: 10px;
  padding: 10px;

  &: hover {
    background-color: #ffffff;
    transition: background-color 250ms linear;
    box-shadow: 0 10px 17px 0 #eff1f9;
  }
`

const WrapText = styled(Text)`
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 230px;
  white-space: nowrap;
`

const Description = styled(Text)`
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  word-break: break-all;
  -webkit-line-clamp: 2;
  height: 38px;
`

export default ({
  community: { name, logo, website, organization, description },
  onClick,
}) => (
  <MiniCard onClick={onClick}>
    {/* Image Logo */}
    <div
      style={{
        borderRadius: '8.5px',
        backgroundImage: `url(${logo})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: '85px',
        height: '85px',
      }}
    />
    <Flex
      flexDirection="column"
      justifyContent="flex-start"
      alignItems="left"
      ml={3}
      width="70%"
      style={{ height: '100%' }}
    >
      <Flex flexDirection="row" alignItems="center">
        <WrapText color={colors.text.normal} size={14} py={1}>
          {name}
        </WrapText>
        <Text color={colors.text.normal} size={14} py={1}>
          {website && (
            <AbsoluteLink
              href={website}
              style={{ marginLeft: 10, fontSize: '0.9em', marginBottom: '4px' }}
              dark
              onClick={e => e.stopPropagation()}
            >
              <Image src={OutImg} />
            </AbsoluteLink>
          )}
        </Text>
      </Flex>
      <WrapText
        fontSize={11}
        lineHeight="20px"
        color={colors.purple.dark}
        fontWeight="300"
      >
        By {organization}
      </WrapText>
      <Description
        lineHeight="19px"
        fontSize={12}
        mt={1}
        color={colors.text.normal}
        width="100%"
      >
        {description}
      </Description>
    </Flex>
  </MiniCard>
)
