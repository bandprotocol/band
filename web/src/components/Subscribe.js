import React from 'react'
import styled from 'styled-components'
import { Text, Button, Flex } from 'ui/common'
import { isMobile } from 'ui/media'
import MailchimpSubscribe from 'react-mailchimp-subscribe'

const Input = styled.input`
  appearance: none;
  padding: ${p => (p.large ? '8px 12px 8px 28px' : '4px 9px 4px 20px')};
  border-radius: 3px;
  background: white;
  border: 0;
  outline: 0;
  font-size: 13px;
  width: ${p => (p.large ? 350 : 250)}px;
  outline: none;
  transition: all 0.2s;

  &::placeholder {
    color: #cccccc;
  }
`

const Container = styled.div`
  display: flex;
  flex-direction: ${p => p.flexDirection};
  background-image: transparent;
  border-radius: 3px;
  max-width: calc(100vw - 40px);
`

// TODO: submit to somewhere
export default class Subscribe extends React.Component {
  state = { value: '', focusing: false, submitted: false }

  submit() {
    this.setState({ submitted: true })
  }

  render() {
    const subscriptionUrl =
      'https://innocation.us18.list-manage.com/subscribe/post?u=05df05446d3afe5957d513703&amp;id=809c988381'

    const { large, column, navbar } = this.props
    const _isMobile = isMobile()
    return (
      <MailchimpSubscribe
        url={subscriptionUrl}
        render={({ subscribe, status, message }) => {
          if (status === 'success') {
            return (
              <div style={{ margin: '14px 0' }}>
                <Text style={{ color: '#ffd368' }}>
                  Hooray! you are now subscribed to our updates.
                </Text>
              </div>
            )
          }

          return (
            <Flex flexDirection="column" style={{ position: 'relative' }}>
              <Container flexDirection={column ? 'column' : 'row'}>
                <Input
                  name="email"
                  large={large}
                  onFocus={() => this.setState({ focusing: true })}
                  onBlur={() => this.setState({ focusing: false })}
                  value={this.state.value}
                  onChange={e => this.setState({ value: e.target.value })}
                  onKeyPress={e => {
                    if (e.key === 'Enter')
                      subscribe({ EMAIL: this.state.value })
                  }}
                  placeholder="email@example.com"
                  mr={column ? '0px' : '10px'}
                  style={{
                    borderRadius: 0,
                    padding: column ? '1em 2em' : '0.5em 1em',
                  }}
                />
                <Button
                  variant="primary"
                  mt={column ? '10px' : '0px'}
                  ml={column ? '0px' : '10px'}
                  style={{
                    fontSize: 14,
                    borderRadius: 0,
                    padding: '1em 2em',
                    fontWeight: 500,
                    fontFamily: 'bio-sans',
                    background: '#2e3a7c',
                  }}
                  onClick={() => subscribe({ EMAIL: this.state.value })}
                >
                  Subscribe
                </Button>
              </Container>

              {status === 'sending' && (
                <Text
                  style={{
                    display: 'block',
                    lineHeight: 1.2,
                    position: 'absolute',
                    top: _isMobile ? '105px' : '50px',
                  }}
                  fontSize={large ? 16 : 12}
                  textAlign={['center', 'left']}
                  color="#ffd368"
                >
                  Beaming to server
                </Text>
              )}
              {message && (
                <Text
                  style={{
                    display: 'block',
                    lineHeight: 1.2,
                    marginLeft: 'auto',
                    maxWidth: _isMobile ? 250 : 380,
                    position: 'absolute',
                    top: _isMobile ? '105px' : '50px',
                  }}
                  fontSize={large ? 16 : 12}
                  textAlign={['center', 'left']}
                  color="#ff6868"
                >
                  <span dangerouslySetInnerHTML={{ __html: message }} />
                </Text>
              )}
            </Flex>
          )
        }}
      />
    )
  }
}
