import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { Flex } from 'ui/common'

import ScrollToTop from 'ScrollToTop'
import Sidebar from 'components/Sidebar'
import CommunitiesPage from 'pages/Communities'
import CommunityDetailPage from 'pages/CommunityDetail'
import CommunityRewardPage from 'pages/CommunityReward'
import CommunityGovernancePage from 'pages/CommunityGovernance'
import CommunityProposalPage from 'pages/CommunityProposal'
import CommunityDataProviderPage from 'pages/CommunityDataProvider'
import CreateCommunityPage from 'pages/CreateCommunity'

export default ({ match, location }) => (
  <React.Fragment>
    <ScrollToTop />
    <Switch location={location}>
      <Route
        path="/community/:community"
        render={({ match, history, location }) => (
          <React.Fragment>
            <Flex flexDirection="row">
              <Sidebar communityAddress={match.params.community} />
              <Switch>
                <Route
                  path="/community/:community/overview"
                  render={({ match }) => (
                    <CommunityDetailPage
                      communityAddress={match.params.community}
                    />
                  )}
                />
                <Route
                  path="/community/:community/reward"
                  render={({ match }) => (
                    <CommunityRewardPage
                      communityAddress={match.params.community}
                    />
                  )}
                />
                <Route
                  path="/community/:community/governance"
                  render={({ match }) => (
                    <CommunityGovernancePage
                      communityAddress={match.params.community}
                    />
                  )}
                />
                <Route
                  path="/community/:community/proposal"
                  render={({ match }) => (
                    <CommunityProposalPage
                      communityAddress={match.params.community}
                    />
                  )}
                />
                <Route
                  path="/community/:community/provider"
                  render={({ match }) => (
                    <CommunityDataProviderPage
                      communityAddress={match.params.community}
                    />
                  )}
                />
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
    </Switch>
  </React.Fragment>
)
