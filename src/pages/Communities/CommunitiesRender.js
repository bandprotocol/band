import React from 'react'
import styled from 'styled-components'
import PageContainer from 'components/PageContainer'
import { colors } from 'ui'
import { Flex, Text, Button, Image, Box, AbsoluteLink, Card } from 'ui/common'

import WorkWithUsSrc from 'images/work-with-us.svg'

const Description = styled(Text)`
  height: 72px;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 4;
  display: -webkit-box;
  -webkit-box-orient: vertical;
`

const BandApp = ({ name, src, link, author, description, children }) => (
  <Card
    variant="primary"
    flex={['', '0 0 340px']}
    p="14px"
    bg="#fff"
    m={2}
    style={{ alignSelf: 'flex-start' }}
  >
    <Flex
      flexDirection={['column-reverse', 'row']}
      alignItems="flex-start"
      pl={[2, 0]}
    >
      <Image
        mt={[0, 1]}
        mb={[2, 0]}
        width={[100, 80]}
        src={src}
        style={{ borderRadius: 4 }}
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
        <Text fontSize={13} color={colors.text.normal} fontWeight="500">
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

const CommingSoon = () => (
  <Flex p={2} justifyContent={['flex-start', 'center']}>
    <Box bg="#eff2ff" p={2} my={1} style={{ borderRadius: '4px' }}>
      <Text fontSize={'14px'} color="#a2b0ea" style={{ fontStyle: 'italic' }}>
        Coming soon
      </Text>
    </Box>
  </Flex>
)

const CommunityPage = ({ communities }) => (
  <React.Fragment>
    <PageContainer>
      <Flex pt={[3, 4]} flexWrap="wrap">
        {communities.map(({ name, logo, description, website, author }) => (
          <BandApp
            key={name}
            name={name}
            src={logo}
            description={description}
            author={author}
            link={website}
          >
            <CommingSoon />
          </BandApp>
        ))}
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
              <Button variant="primary" my={1}>
                Apply Now!
              </Button>
            </AbsoluteLink>
          </Flex>
        </BandApp>
      </Flex>
    </PageContainer>
  </React.Fragment>
)

export default CommunityPage
