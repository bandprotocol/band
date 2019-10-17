import React from 'react'
import { connect } from 'react-redux'
import { Route, Switch, Redirect, withRouter } from 'react-router-dom'
import { Flex } from 'ui/common'
import ScrollToTop from 'ScrollToTop'
import TCDRoutes from 'TCDRoutes'
import Backdrop from 'components/Backdrop'
import Sidebar from 'components/Sidebar'
import CommunitiesPage from 'pages/Communities'
import CommunityDetailPage from 'pages/CommunityDetail'
import CommunityParameterPage from 'pages/CommunityParameter'
import CommunityProposalPage from 'pages/CommunityProposal'
import { communitySelector } from 'selectors/basic'
import NotFound from 'pages/NotFound'

const Routes = ({ location, communities }) => {
  return (
    <React.Fragment>
      <ScrollToTop />
      <Switch location={location}>
        <Route
          path="/community/:community/"
          render={({ match }) => {
            const communityAddr = match.params.community
            if (!communityAddr) return <Redirect to="/"></Redirect>

            const foundCommunityAddress = communities.find(
              community => community === communityAddr,
            )
            if (!foundCommunityAddress) {
              return <Redirect to="/"></Redirect>
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
        {/* Redirect if there is no community address */}
        <Route path="/community" exact render={() => <Redirect to="/" />} />

        {/* <Route
            exact
            path="/create-community"
            component={CreateCommunityPage}
          /> */}
        <Route exact path="/" component={CommunitiesPage} />
        {/* Redirect if there is no path */}
        <Route component={NotFound} />
      </Switch>
    </React.Fragment>
  )
}

const mapStateToProps = state => {
  const communities = communitySelector(state)
  return { communities: Object.keys(communities.toJS()) }
}

export default withRouter(connect(mapStateToProps)(Routes))
