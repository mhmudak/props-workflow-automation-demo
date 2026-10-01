const {
    validateMcq,
    handleMcq,
} = require('../handlers/mcq.handler')

function validateAssessment(
    assessment
) {
    if (
        !assessment ||
        typeof assessment !== 'object'
    ) {
        throw new Error(
            'Assessment must be an object.'
        )
    }

    switch (assessment.type) {
        case 'mcq':
            validateMcq(assessment)
            return true

        default:
            throw new Error(
                `Unsupported assessment type: ${assessment.type}`
            )
    }
}

async function processAssessment(
    assessment,
    adapter
) {
    // Defensive validation remains here
    // even when batch preflight was used.
    validateAssessment(
        assessment
    )

    switch (assessment.type) {
        case 'mcq':
            return handleMcq(
                assessment,
                adapter
            )

        default:
            throw new Error(
                `Unsupported assessment type: ${assessment.type}`
            )
    }
}

module.exports = {
    validateAssessment,
    processAssessment,
}