import React from 'react'
import styled from 'styled-components'
import { Text, Button } from 'ui/common'
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

    const { large } = this.props

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
            <React.Fragment>
              <Container>
                <Input
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
                  mr="10px"
                  style={{ borderRadius: 0 }}
                />

                <Button
                  variant="primary"
                  ml="10px"
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
                    marginTop: '10px',
                  }}
                  fontSize={large ? 16 : 12}
                  textAlign={['center', 'right']}
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
                    marginTop: '10px',
                    marginLeft: 'auto',
                    maxWidth: 400,
                  }}
                  fontSize={large ? 16 : 12}
                  textAlign={['center', 'right']}
                  color="#ff6868"
                >
                  <span
                    style={{ marginLeft: 5 }}
                    dangerouslySetInnerHTML={{ __html: message.slice(3) }}
                  />
                </Text>
              )}
            </React.Fragment>
          )
        }}
      />
    )
  }
}
