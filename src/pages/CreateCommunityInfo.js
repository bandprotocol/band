import React from 'react'
import { Flex, Text, Image } from 'ui/common'
import styled from 'styled-components'
import ImageUpload from 'components/ImageUpload'
import { Label, Field, Input, TextArea } from 'components/Form'
import colors from 'ui/colors'

const DarkLabel = styled(Label).attrs({
  color: colors.purple.dark,
})`
  font-size: 16px;
  font-weight: 500;
  text-align: ${props => props.textAlign};
`

const RedHighlight = styled.span`
  padding-left: 3px;
  font-weight: 200;
  color: red;
`

const A = styled.a`
  color: #4e3ca9;
  text-decoration: underline;
`

export default ({
  name,
  symbol,
  description,
  url,
  logoUrl,
  bannerUrl,
  organization,
  handleChange,
  setKeyValue,
}) => (
  <Flex flexDirection="column" justifyContent="center" alignItems="center">
    <Flex width="535px" mt="40px" flexDirection="column" alignItems="center">
      <Text fontSize="20px" fontWeight={500} color={colors.purple.dark}>
        Basic Information
      </Text>
      <Text
        fontSize="16px"
        fontWeight={300}
        textAlign="center"
        mt="10px"
        lineHeight={1.69}
        letterSpacing={0.6}
      >
        Set up basic community information. These settings will be availble on
        the community's detail page. Information can be changed in the future
        through Governance mechanism.{' '}
        <A style={{ textDecoration: 'underline' }}>Learn more</A>
      </Text>
    </Flex>
    <Flex flexDirection="row" mt="40px">
      <Flex flexDirection="column" mr="50px">
        <DarkLabel color={colors}>
          Upload Logo <RedHighlight>*</RedHighlight>
        </DarkLabel>
        <Flex mt="10px" style={{ position: 'relative' }}>
          <ImageUpload
            imgUrl={logoUrl}
            saveImageUrl={imageUrl =>
              handleChange({ target: { name: 'logoUrl', value: imageUrl } })
            }
            removeImageUrl={() =>
              handleChange({ target: { name: 'logoUrl', value: null } })
            }
            setImgHash={imgHash => setKeyValue('info:logo', imgHash)}
            fontSize="12px"
          />
        </Flex>
      </Flex>
      <Flex flexDirection="column">
        <DarkLabel color={colors} textAlign="center">
          Upload banner <RedHighlight>*</RedHighlight>
        </DarkLabel>
        <Flex mt="10px" style={{ position: 'relative' }}>
          <ImageUpload
            imgUrl={bannerUrl}
            saveImageUrl={imageUrl =>
              handleChange({ target: { name: 'bannerUrl', value: imageUrl } })
            }
            removeImageUrl={() =>
              handleChange({ target: { name: 'bannerUrl', value: null } })
            }
            setImgHash={imgHash => setKeyValue('info:banner', imgHash)}
            width={320}
            banner
          />
        </Flex>
      </Flex>
    </Flex>
    {/* Input Section */}
    <Flex flexDirection="column" justifyContent="center">
      <Flex flexDirection="row" alignItems="center" mt="30px">
        <Field px={3}>
          <DarkLabel color={colors}>
            Name<RedHighlight>*</RedHighlight>
          </DarkLabel>
          <Input
            type="text"
            placeholder="Your community name"
            value={name}
            name="name"
            width="250px"
            onChange={handleChange}
            autoFocus
          />
        </Field>
        <Field px={3}>
          <DarkLabel>
            Symbol<RedHighlight>*</RedHighlight>
          </DarkLabel>
          <Input
            type="text"
            placeholder="Your community symbol"
            value={symbol}
            name="symbol"
            width="250px"
            onChange={handleChange}
          />
        </Field>
      </Flex>
      <Field px={3} py={2}>
        <Flex flexDirection="row" alignItems="center">
          <DarkLabel>Description</DarkLabel>
          <Flex color="#4a4a4a" fontSize="16px">
            (write a short 50 - 150 words)
          </Flex>
          <RedHighlight>*</RedHighlight>
        </Flex>
        <TextArea
          type="text"
          width="100%"
          height="150px"
          placeholder="Your community symbol"
          value={description}
          name="description"
          onChange={handleChange}
        />
      </Field>
      <Field px={3} py={1}>
        <DarkLabel>
          URL<RedHighlight>*</RedHighlight>
        </DarkLabel>
        <Input
          type="text"
          width="100%"
          placeholder="Your community website"
          value={url}
          name="url"
          onChange={handleChange}
        />
      </Field>
      <Field px={3} pt={1} pb={6}>
        <DarkLabel>
          Organization<RedHighlight>*</RedHighlight>
        </DarkLabel>
        <Input
          type="text"
          width="100%"
          placeholder="Your organization"
          value={organization}
          name="organization"
          onChange={handleChange}
        />
      </Field>
    </Flex>
  </Flex>
)
