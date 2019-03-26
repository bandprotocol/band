import React from 'react'
import { Flex, Text, Image } from 'ui/common'
import styled from 'styled-components'
import ImageUpload from 'components/ImageUpload'
import { Label, Field, Input, TextArea } from 'components/Form'
import colors from 'ui/colors'
import EditPen from 'images/editPen.svg'

const DarkLabel = styled(Label).attrs({
  color: colors.purple.dark,
})`
  font-size: 16px;
  font-weight: 500;
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
  organization,
  handleChange,
  setKeyValue,
}) => (
  <Flex flexDirection="column" justifyContent="center" alignItems="center">
    <Flex width="535px" mt="40px" flexDirection="column" alignItems="center">
      <Text fontSize="20px" fontWeight={500} color="#4e3ca9">
        Create Community
      </Text>
      <Text
        fontSize="16px"
        fontWeight={300}
        textAlign="center"
        mt="10px"
        lineHeight={1.69}
        letterSpacing={0.6}
      >
        Spicy jalapeno bacon ipsum dolor amet sausage pig jerky tail tongue
        frankfurter andouille.{' '}
        <A style={{ 'text-decoration': 'underline' }}>Learn more</A>
      </Text>
    </Flex>
    <Flex flexDirection="row" mt="40px">
      <Flex flexDirection="column" mr="50px">
        <DarkLabel color={colors}>
          Upload Logo <RedHighlight>*</RedHighlight>
        </DarkLabel>
        <Flex mt="10px" style={{ position: 'relative' }}>
          <ImageUpload
            setImgHash={imgHash => setKeyValue('info:logo', imgHash)}
            fontSize="12px"
            description={'200x200 KB'}
          />
          <Flex
            style={{ position: 'absolute', bottom: '-10px', right: '-5px' }}
          >
            <Image src={EditPen} width="30px" height="30px" block />
          </Flex>
        </Flex>
      </Flex>
      <Flex flexDirection="column">
        <DarkLabel color={colors}>
          Upload banner <RedHighlight>*</RedHighlight>
        </DarkLabel>
        <Flex mt="10px" style={{ position: 'relative' }}>
          <ImageUpload
            setImgHash={imgHash => setKeyValue('info:banner', imgHash)}
            width={320}
            description={'size: 320x160 pixels 200x200 KB'}
          />
          <Flex
            style={{ position: 'absolute', bottom: '-10px', right: '-5px' }}
          >
            <Image src={EditPen} width="30px" height="30px" block />
          </Flex>
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
