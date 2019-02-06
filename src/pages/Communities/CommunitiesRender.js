import React from 'react'
import styled from 'styled-components/macro'
import PageContainer from 'components/PageContainer'
import { colors } from 'ui'
import BN from 'utils/bignumber'
import {
  Flex,
  Text,
  Button,
  Image,
  Box,
  AbsoluteLink,
  Card,
  Bold,
} from 'ui/common'
import CircleLoadingSpinner from 'components/CircleLoadingSpinner'

import WorkWithUsSrc from 'images/work-with-us.svg'

const Description = styled(Text)`
  height: 54px;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 3;
  display: -webkit-box;
  -webkit-box-orient: vertical;
`

const BandApp = ({
  name,
  src,
  link,
  author,
  description,
  children,
  onClick,
}) => (
  <Card
    variant="primary"
    flex={['', '0 0 395px']}
    p="14px"
    bg="#fff"
    mx={2}
    mb={3}
    css={{
      alignSelf: 'flex-start',
      ...(onClick
        ? {
            cursor: 'pointer',
            transition: 'all 200ms',
            '&:hover': {
              border: `solid 1px ${colors.purple.light}`,
            },
          }
        : {}),
    }}
    onClick={onClick}
  >
    <Flex
      flexDirection={['column-reverse', 'row']}
      alignItems="flex-start"
      pl={[2, 0]}
    >
      <Image
        mt={[0, 1]}
        mb={[2, 0]}
        width={[100, 110]}
        src={src}
        style={{ borderRadius: 2 }}
      />
      <Box flex={1} ml={[0, '20px']}>
        <Flex>
          <Text
            color={colors.purple.dark}
            size={16}
            fontWeight="500"
            lineHeight={2}
          >
            {name}

            {link && (
              <AbsoluteLink
                href={link}
                style={{ marginLeft: 10, fontSize: '0.9em' }}
                dark
              >
                <i class="fas fa-external-link-alt" />
              </AbsoluteLink>
            )}
          </Text>
        </Flex>
        <Text fontSize={12} color={colors.text.normal} fontWeight="500">
          By {author}
        </Text>
        <Description lineHeight={1.5} fontSize={12} my={3}>
          {description}
        </Description>
      </Box>
    </Flex>
    {children}
  </Card>
)

const PriceDetail = ({ marketCap, price, last24Hrs }) => (
  <Flex
    flexDirection="row"
    pt={2}
    pb={1}
    justifyContent="space-around"
    alignItems="center"
  >
    <Flex flexDirection="column" justifyContent="center" alignItems="center">
      <Bold fontSize={12}>Market Cap.</Bold>
      <Text
        color={colors.purple.normal}
        fontSize={1}
        fontWeight="bold"
        py="12px"
      >
        $ {marketCap.shortPretty()}
      </Text>
    </Flex>
    <Flex
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      px={3}
    >
      <Bold fontSize={12}>Price</Bold>
      <Text
        color={colors.purple.normal}
        fontSize={1}
        fontWeight="bold"
        py="12px"
      >
        $ {price.shortPretty()}
      </Text>
    </Flex>
    <Flex flexDirection="column" justifyContent="center" alignItems="center">
      <Bold fontSize={12}>Last 24 hrs.</Bold>
      <Text
        color={last24Hrs >= 0.0 ? colors.green.normal : colors.red.normal}
        fontSize={1}
        fontWeight="bold"
        py="12px"
      >
        {last24Hrs >= 0.0 ? '+' : null}
        {last24Hrs} %
      </Text>
    </Flex>
  </Flex>
)

const CommunityPage = ({ communities, bandPrice, history }) => (
  <React.Fragment>
    <PageContainer>
      <Flex justifyContent="center" flexWrap="wrap">
        {communities && communities.length ? (
          <React.Fragment>
            {communities.map(
              ({
                name,
                logo,
                description,
                website,
                author,
                marketCap,
                price,
                last24Hrs,
              }) => (
                <BandApp
                  key={name}
                  name={name}
                  src={logo}
                  description={description}
                  author={author}
                  link={website}
                  onClick={() => history.push(`/community/${name}/detail`)}
                >
                  <PriceDetail
                    marketCap={BN.parse(marketCap).bandToUSD(bandPrice)}
                    price={BN.parse(price).bandToUSD(bandPrice)}
                    last24Hrs={last24Hrs.toFixed(2)}
                  />
                </BandApp>
              ),
            )}
            <BandApp
              name="Work with us"
              src={WorkWithUsSrc}
              author="Band Protocol"
              description="Already have an idea or working app. Want to incorporate Band protocol, contact us for help or grant query."
            >
              <Flex p={2} justifyContent={['flex-start', 'center']}>
                <AbsoluteLink
                  style={{ fontSize: 14 }}
                  href="https://bandprotocol.typeform.com/to/A39Zgd"
                >
                  <Button
                    variant="primary"
                    my={1}
                    style={{
                      fontSize: 14,
                      boxShadow: '0 4px 5px 0 rgba(136, 104, 255, 0.26)',
                    }}
                  >
                    Apply Now!
                  </Button>
                </AbsoluteLink>
              </Flex>
            </BandApp>
          </React.Fragment>
        ) : (
          <Flex style={{ height: 225 }} alignItems="center">
            <CircleLoadingSpinner radius="20" />
          </Flex>
        )}
      </Flex>
    </PageContainer>
  </React.Fragment>
)

export default CommunityPage
