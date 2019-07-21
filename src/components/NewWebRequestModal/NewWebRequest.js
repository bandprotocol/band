import React from 'react'
import styled from 'styled-components'
import { Flex, Text } from 'ui/common'
import { connect } from 'react-redux'
import { hideModal } from 'actions'
import { bandBalanceSelector } from 'selectors/balances'
import { communityDetailSelector } from 'selectors/communities'
import { currentCommunityClientSelector } from 'selectors/current'
import { communityBalanceSelector } from 'selectors/balances'
import ApplyState from './ApplyState'
import axios from 'axios'
import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'

const Container = styled(Flex).attrs({
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
})`
  padding: 30px 25px 15px;
  width: 640px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 5px 20px 0 rgba(0, 0, 0, 0.45);
`

const InnerContainer = styled.div`
  width: 430px;
`

class NewWebRequestModal extends React.Component {
  state = {
    json: '',
    pageState: 1,
  }

  changePage = pageState => this.setState({ pageState })

  handleChange = e => {
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
    const { pageState, json } = this.state
    return (
      <Container>
        <Flex flexDirection="column" alignItems="center" width="100%">
          <Text
            fontFamily="head"
            fontSize="20px"
            my="10px"
            fontWeight="bold"
            color="#4a4a4a"
          >
            Add a New Endpoint
          </Text>
          <Text m={2} fontSize="14px" fontWeight="400" color="#4a4a4a">
            Make any API calls on the internet and make the result available
            on-chain
          </Text>
          <ApplyState pageState={pageState} />
          <InnerContainer>
            {pageState === 1 ? (
              <Step1
                onNext={() => this.changePage(2)}
                setJson={json => this.setState({ json })}
              />
            ) : pageState === 2 ? (
              <Step2 onNext={() => this.changePage(3)} json={json} />
            ) : pageState === 3 ? (
              <Step3 onNext={() => this.props.hideModal()} json={json} />
            ) : null}
          </InnerContainer>
        </Flex>
      </Container>
    )
  }
}

const mapStateToProps = (state, { type, tokenAddress }) => {
  const community = communityDetailSelector(state, {
    address: tokenAddress,
  })
  if (!community) return {}
  return {
    name: community.get('name'),
    logo: community.get('logo'),
    symbol: community.get('symbol'),
    bandBalance: bandBalanceSelector(state),
    tokenBalance: communityBalanceSelector(state, { address: tokenAddress }),
    tokenNormalPrice: community.get('price'),
    type: type,
    communityClient: currentCommunityClientSelector(state, {
      address: tokenAddress,
    }),
  }
}

const mapDispatchToProps = dispatch => ({
  hideModal: () => dispatch(hideModal()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NewWebRequestModal)
