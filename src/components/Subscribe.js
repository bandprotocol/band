import React from 'react'
import styled from 'styled-components'
import { Text, Button } from 'ui/common'
import { colors } from 'ui'
import MailchimpSubscribe from 'react-mailchimp-subscribe'

const Input = styled.input`
  appearance: none;
  padding: ${p => (p.large ? '8px 12px 8px 28px' : '4px 9px 4px 20px')};
  border-radius: 0.35em;
  background: white;
  border: 0;
  outline: 0;
  font-size: ${p => (p.large ? 16 : 14)}px;
  width: ${p => (p.large ? 350 : 250)}px;
  outline: none;
  transition: all 0.2s;

  &::placeholder {
    color: #4e3ca9;
  }
`

const Container = styled.div`
  display: flex;
  background: #ffffff;
  border-radius: 0.35em;
  max-width: calc(100vw - 40px);
  border: solid 1px ${colors.purple.normal};
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
                />

                <Button
                  variant="primary"
                  style={{
                    fontSize: large ? 13 : 12,
                    borderBottomLeftRadius: 0,
                    borderTopLeftRadius: 0,
                    padding: large ? '1em 2em' : '0.8em 1em',
                    fontWeight: 600,
                    marginLeft: 'auto',
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
