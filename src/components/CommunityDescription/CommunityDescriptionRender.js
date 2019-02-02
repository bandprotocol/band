import React from 'react'
import { colors } from 'ui'
import { Flex, Text, Image, Box, AbsoluteLink, Card } from 'ui/common'

export default ({ name, src, link, author, description }) => (
  <Card
    variant="detail"
    p="25px"
    bg="#fff"
    style={{ alignSelf: 'flex-start' }}
    mb="10px"
  >
    <Flex
      flexDirection={['column-reverse', 'row']}
      alignItems="flex-start"
      pl={2}
    >
      <Image
        mt={[0, 1]}
        mb={[2, 0]}
        width={[200, 180]}
        src={src}
        style={{ borderRadius: 4 }}
      />
      <Box flex={1} ml={[0, '30px']}>
        <Flex>
          <Text
            color={colors.purple.dark}
            size={20}
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
                <i className="fas fa-external-link-alt" />
              </AbsoluteLink>
            )}
          </Text>
        </Flex>
        <Text fontSize={12} color={colors.text.normal} fontWeight="500">
          By {author}
        </Text>
        <Text lineHeight={1.5} fontSize={12} my={3}>
          {description}
        </Text>
      </Box>
    </Flex>
  </Card>
)
