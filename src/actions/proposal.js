export const LOAD_PROPOSALS = 'LOAD_PROPOSALS'
export const SAVE_PROPOSALS = 'SAVE_PROPOSALS'
export const VOTE_PROPOSAL = 'VOTE_PROPOSAL'

export const loadProposals = address => ({
  type: LOAD_PROPOSALS,
  address,
})

export const saveProposals = (address, proposals) => ({
  type: SAVE_PROPOSALS,
  address,
  proposals,
})

export const voteProposal = (address, proposalId, vote) => ({
  type: VOTE_PROPOSAL,
  address,
  proposalId,
  vote,
})
