import React from 'react'
import { connect } from 'react-redux'
import { Route, Switch, Redirect, withRouter } from 'react-router-dom'
import { Flex } from 'ui/common'

import ScrollToTop from 'ScrollToTop'
import TCDRoutes from 'TCDRoutes'
import { BackdropProvider } from 'context/backdrop'
import Backdrop from 'components/Backdrop'
import Sidebar from 'components/Sidebar'
import CommunitiesPage from 'pages/Communities'
import CommunityDetailPage from 'pages/CommunityDetail'
import CommunityParameterPage from 'pages/CommunityParameter'
import CommunityProposalPage from 'pages/CommunityProposal'
import CreateCommunityPage from 'pages/CreateCommunity'
import { tcdsSelector } from 'selectors/tcd'
import { communityDetailSelector } from 'selectors/communities'
import { communitySelector } from 'selectors/basic'

const Routes = ({ match, location, communitiesId }) => {
  return (
    <React.Fragment>
      <ScrollToTop />
      <Switch location={location}>
        <BackdropProvider>
          <Route
            path="/community/:community/"
            render={({ match, history, location }) => {
              const communityAdd = match.params.community
              if (communityAdd) {
                const foundCommunityAddress = communitiesId.find(
                  community => community === communityAdd,
                )
                if (!foundCommunityAddress) {
                  return <Redirect to="/"></Redirect>
                }
              }
              return (
                <React.Fragment>
                  <Flex
                    flexDirection="row"
                    style={{
                      minHeight: '100vh',
                    }}
                  >
                    <Sidebar tokenAddress={match.params.community} />
                    <Backdrop />
                    <Switch>
                      {/* Global Routes */}
                      <Route
                        path="/community/:community/overview"
                        render={({ match }) => (
                          <CommunityDetailPage
                            tokenAddress={match.params.community}
                          />
                        )}
                      />
                      <Route
                        path="/community/:community/parameters"
                        render={({ match, location }) => (
                          <CommunityParameterPage
                            tokenAddress={match.params.community}
                            qs={location.search}
                          />
                        )}
                      />
                      <Route
                        path="/community/:community/proposal"
                        render={({ match }) => (
                          <CommunityProposalPage
                            tokenAddress={match.params.community}
                          />
                        )}
                      />

                      {/* TCD Routes */}
                      <Route
                        path="/community/:community/:path"
                        render={({ match }) => (
                          <TCDRoutes
                            communityAddress={match.params.community}
                            path={match.params.path}
                          />
                        )}
                      />

                      {/* Default TCD Route */}
                      {/* <Route
                    path="/community/:community/"
                    render={({ match }) => (
                      <Redirect
                        to={`/community/${match.params.community}/${match.params.tcd}/dataset`}
                      />
                    )}
                  /> */}
                      {/* Default Global Route */}
                      <Route
                        path="/community/:community"
                        exact
                        render={({ match }) => (
                          <Redirect
                            to={`/community/${match.params.community}/overview`}
                          />
                        )}
                      />
                    </Switch>
                  </Flex>
                </React.Fragment>
              )
            }}
          />

          <Route
            exact
            path="/create-community"
            component={CreateCommunityPage}
          />
          <Route exact path="/" component={CommunitiesPage} />
        </BackdropProvider>
      </Switch>
    </React.Fragment>
  )
}

const mapStateToProps = (state, props) => {
  const communities = communitySelector(state)
  return { communitiesId: Object.keys(communities.toJS()) }
}

export default withRouter(connect(mapStateToProps)(Routes))
