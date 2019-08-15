export const LOAD_PARAMETERS = 'LOAD_PARAMETERS'
export const SAVE_PARAMETERS = 'SAVE_PARAMETERS'
export const PROPOSE_PROPOSAL = 'PROPOSE_PROPOSAL'

export const loadParameters = address => ({
  type: LOAD_PARAMETERS,
  address,
})

export const saveParameters = (address, parameters) => ({
  type: SAVE_PARAMETERS,
  address,
  parameters,
})

export const proposeProposal = (address, title, reason, changes) => ({
  type: PROPOSE_PROPOSAL,
  address,
  title,
  reason,
  changes,
})
