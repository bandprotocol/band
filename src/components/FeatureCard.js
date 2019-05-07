import React from 'react'
import { Flex, Text } from 'ui/common'

export default ({
  subtitle,
  title,
  content,
  linkText,
  link,
  style = {},
  children,
  ...props
}) => (
  <Flex
    bg="#f7f8ff"
    style={{
      width: '425px',
      height: '325px',
      borderRadius: '10px',
      boxShadow: '0 23px 20px 0 rgba(0, 0, 0, 0.25)',
      ...style,
    }}
    flexDirection="column"
    {...props}
  >
    <Flex pt="30px" pl="30px" flexDirection="column">
      <Text color="#6b8bf5" fontWeight={500} mb="10px">
        {subtitle}
      </Text>
      <Text color="#2b314f" fontWeight={700} fontSize="24px">
        {title}
      </Text>
      <Flex my="5px" />
      <Text fontWeight={300} lineHeight={1.57} color="#4c4c4c" fontSize="14px">
        {content}
      </Text>
    </Flex>
    <Flex my="15px" />
    {children}
    <Flex
      pl="30px"
      style={{
        borderTop: '1px solid #eaeeff',
        position: 'relative',
        height: 60,
      }}
      mt="auto"
      flex="0 0 60px"
      alignItems="center"
    >
      <Text color="#252945">{linkText}</Text>
      <Flex style={{ position: 'absolute', right: '30px' }}>
        <Text color="#6b8bf5" fontWeight={900}>
          <i className="fas fa-chevron-right" />
        </Text>
      </Flex>
    </Flex>
  </Flex>
)
