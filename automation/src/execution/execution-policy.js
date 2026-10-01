const EXECUTION_POLICIES =
  Object.freeze({
    'strict-sequential':
      Object.freeze({
        name:
          'strict-sequential',

        haltOnError: true,
      }),

    'continue-on-error':
      Object.freeze({
        name:
          'continue-on-error',

        haltOnError: false,
      }),
  })

function getExecutionPolicy(
  policyName =
    'strict-sequential'
) {
  const policy =
    EXECUTION_POLICIES[
      policyName
    ]

  if (!policy) {
    const supported =
      Object.keys(
        EXECUTION_POLICIES
      ).join(', ')

    throw new Error(
      `Unknown execution policy "${policyName}". Supported policies: ${supported}`
    )
  }

  return policy
}

module.exports = {
  EXECUTION_POLICIES,
  getExecutionPolicy,
}