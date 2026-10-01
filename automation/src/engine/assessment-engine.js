const {
  handleMcq,
} = require('../handlers/mcq.handler')

async function processAssessment(
  assessment,
  adapter
) {
  if (!assessment.type) {
    throw new Error(
      'Assessment type is required.'
    )
  }

  switch (assessment.type) {
    case 'mcq':
      await handleMcq(
        assessment,
        adapter
      )
      break

    default:
      throw new Error(
        `Unsupported assessment type: ${assessment.type}`
      )
  }
}

module.exports = {
  processAssessment,
}