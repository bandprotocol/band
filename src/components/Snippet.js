import React from 'react'
import styled from 'styled-components'
import { Card, Text, Flex } from 'ui/common'
import colors from 'ui/colors'
import Prism from 'prismjs'
import { createGlobalStyle } from 'styled-components'

const SnippetStyle = createGlobalStyle`
code[class*="language-"],
pre[class*="language-"] {
 color: #f8f8f2;
 background: none;
 text-shadow: 0 1px rgba(0, 0, 0, 0.3);
 font-family: "Source Code Pro", monospace;
 font-size: 1em;
 text-align: left;
 white-space: pre;
 word-spacing: normal;
 word-break: normal;
 word-wrap: normal;
 line-height: 1.4;
 -moz-tab-size: 4;
 -o-tab-size: 4;
 tab-size: 4;
 -webkit-hyphens: none;
 -moz-hyphens: none;
 -ms-hyphens: none;
 hyphens: none;
}

/* Code blocks */
pre[class*="language-"] {
 overflow: auto;
}
pre[class*="language-"] * {
 overflow: auto;
 font-family: "Source Code Pro", monospace;
 font-weight: 500;
}

/* Inline code */
:not(pre) > code[class*="language-"] {
 padding: 0.1em;
 border-radius: 0.3em;
 white-space: normal;
}

.token.comment,
.token.prolog,
.token.doctype,
.token.cdata {
 color: #d3dcff;
}

.token.punctuation {
 color: #f8f8f2;
}

.namespace {
 opacity: 0.7;
}

.token.property,
.token.tag,
.token.constant,
.token.symbol,
.token.deleted {
 color: #ff79c6;
}

.token.boolean,
.token.number {
 color: #d4c7ff;
}

.token.selector,
.token.attr-name,
.token.string,
.token.char,
.token.builtin,
.token.inserted {
 color: #b5edff;
}

.token.operator,
.token.entity,
.token.url,
.language-css .token.string,
.style .token.string,
.token.variable {
 color: #f8f8f2;
}

.token.atrule,
.token.attr-value,
.token.class-name {
 color: #ffd777;
}

.token.function {
 color: #ffec86;
}

.token.keyword {
 color: #38ffb9;
}

.token.regex,
.token.important {
 color: #f1fa8c;
}

.token.important,
.token.bold {
 font-weight: bold;
}

.token.italic {
 font-style: italic;
}

.token.entity {
 cursor: help;
}
`

const TabOption = styled(Text).attrs(p => ({
  fontFamily: 'code',
  fontSize: '14px',
  px: '28px',
  lineHeight: 2.2,
  fontWeight: 'bold',
}))`
  display: block;
  background: ${p => (p.active ? '#3C3D5B' : 'transparent')};
  cursor: ${p => (p.active ? 'default' : 'pointer')};
  color: ${p => (p.active ? 'white' : '#B4B8D5')};

  ${p =>
    p.active &&
    `
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    box-shadow: ${colors.shadow.dark};
  `};
`

const CodeContainer = styled(Text).attrs(p => ({
  fontFamily: 'code',
  fontSize: '14px',
  px: '24px',
  py: '18px',
  color: colors.white,
}))`
  display: block;
  position: relative;
  z-index: 1;
  background: #4d4e68;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  white-space: pre-wrap;
`

const renderSolidity = code => {
  return (
    <CodeContainer>
      <pre className="language-javascript">
        <div
          dangerouslySetInnerHTML={{
            __html: Prism.highlight(
              code.trim(),
              Prism.languages.javascript,
              'javascript',
            ),
          }}
        />
      </pre>
    </CodeContainer>
  )
}

export default class Snippet extends React.Component {
  state = {
    tab: 'solidity',
  }

  render() {
    const { dataset, codeIndex, code } = this.props

    return (
      <React.Fragment>
        <SnippetStyle />
        <Card
          borderRadius="10px"
          bg="#31314C"
          boxShadow={colors.shadow.dark}
          style={{ overflow: 'hidden' }}
        >
          <Flex>
            <TabOption
              active={this.state.tab === 'solidity'}
              onClick={() => this.setState({ tab: 'solidity' })}
            >
              Solidity
            </TabOption>
            <Text
              ml="auto"
              color="#C6C8FF"
              fontFamily="code"
              fontSize="13px"
              lineHeight="30px"
              mr={3}
            >
              <span
                style={{
                  display: 'inline-block',
                  fontWeight: '600',
                  fontFamily: 'inherit',
                }}
              >
                Provider Fee:
              </span>{' '}
              {this.state.tab === 'solidity' ? '0.001 ETH/query' : 'free'}
            </Text>
          </Flex>
          {renderSolidity(code[codeIndex || 0])}
        </Card>
      </React.Fragment>
    )
  }
}
