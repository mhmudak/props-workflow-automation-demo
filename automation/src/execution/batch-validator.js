const {
  validateAssessment,
} = require(
  '../engine/assessment-engine'
)

function validateBatch(
  assessments
) {
  if (!Array.isArray(assessments)) {
    throw new Error(
      'Batch input must be an array.'
    )
  }

  if (assessments.length === 0) {
    throw new Error(
      'Batch input is empty.'
    )
  }

  const sourceIds =
    new Set()

  const errors = []

  assessments.forEach(
    (assessment, index) => {
      const position =
        index + 1

      const sourceId =
        assessment?.sourceId

      if (!sourceId) {
        errors.push(
          `Item ${position}: sourceId is required.`
        )
      } else if (
        sourceIds.has(sourceId)
      ) {
        errors.push(
          `Item ${position}: duplicate sourceId "${sourceId}".`
        )
      } else {
        sourceIds.add(
          sourceId
        )
      }

      try {
        validateAssessment(
          assessment
        )
      } catch (error) {
        const label =
          sourceId ??
          `Item ${position}`

        errors.push(
          `${label}: ${error.message}`
        )
      }
    }
  )

  if (errors.length > 0) {
    throw new Error(
      [
        'Batch preflight failed:',
        ...errors.map(
          (error) =>
            `- ${error}`
        ),
      ].join('\n')
    )
  }

  return {
    total:
      assessments.length,
  }
}

module.exports = {
  validateBatch,
}