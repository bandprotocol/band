import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
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

export default ({ match, location }) => (
  <React.Fragment>
    <ScrollToTop />
    <Switch location={location}>
      <BackdropProvider>
        <Route
          path="/community/:community/"
          render={({ match, history, location }) => (
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
          )}
        />

        <Route exact path="/create-community" component={CreateCommunityPage} />
        <Route exact path="/" component={CommunitiesPage} />
      </BackdropProvider>
    </Switch>
  </React.Fragment>
)
