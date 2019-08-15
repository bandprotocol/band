import React from 'react'
import axios from 'axios'
import styled from 'styled-components'
import { Flex, Text } from 'ui/common'
import ApplyState from './ApplyState'
import InputAddress from './InputAddress'
import TweetAddress from './TweetAddress'
import InputTwitterLink from './InputTwitterLink'
import Result from './Result'

const Container = styled(Flex).attrs({
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
})`
  padding: 30px 25px 15px;
  width: 640px;
  height: 400px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 5px 20px 0 rgba(0, 0, 0, 0.45);
`

export default class ApplyIdentityModal extends React.Component {
  state = {
    address: '',
    link: '',
    submit: false,
    loading: false,
    txHash: null,
    pageState: 0,
  }

  handleChange(e) {
    const { name, value } = e.target
    this.setState({
      [name]: value,
    })
  }

  async submitLink() {
    this.setState(
      {
        submit: true,
        loading: true,
      },
      async () => {
        try {
          const { data } = await axios.post(
            `https://ident.bandprotocol.com/apply`,
            {
              link: this.state.link,
            },
          )
          this.setState({
            txHash: data.txHash,
            loading: false,
          })
        } catch (err) {
          console.error(err)
          this.setState({
            loading: false,
          })
        }
      },
    )
  }

  render() {
    const { pageState, link, loading, txHash, submit } = this.state
    return (
      <Container>
        <Flex flexDirection="column" alignItems="center" width="100%">
          <Text fontSize="20px" my="10px" fontWeight="bold" color="#4a4a4a">
            Apply for an Identity
          </Text>
          <Text fontSize="14px" fontWeight="400" color="#4a4a4a">
            In the testnet Band only verify you identity via Twitter. More to
            come soon!
          </Text>
          <ApplyState pageState={pageState} />
          {pageState === 0 ? (
            <InputAddress
              address={this.state.address}
              handleAddress={this.handleChange.bind(this)}
              submitAddress={() =>
                this.setState({
                  pageState: 1,
                })
              }
            />
          ) : pageState === 1 ? (
            <TweetAddress
              address={this.state.address}
              onShareWindowClose={() =>
                this.setState({
                  pageState: 2,
                })
              }
            />
          ) : submit ? (
            <Result
              loading={loading}
              txHash={txHash}
              hideModal={this.props.hideModal}
            />
          ) : (
            <InputTwitterLink
              submitLink={this.submitLink.bind(this)}
              link={link}
              handleLink={this.handleChange.bind(this)}
            />
          )}
        </Flex>
      </Container>
    )
  }
}
