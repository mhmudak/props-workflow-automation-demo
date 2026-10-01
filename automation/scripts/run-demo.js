const fs = require('fs')
const path = require('path')

const {
    runAssessment,
} = require('../src/runtime/assessment-runner')

const dataPath = path.join(
    __dirname,
    '..',
    'data',
    'sample-question.json'
)

const assessment = JSON.parse(
    fs.readFileSync(dataPath, 'utf8')
)

async function run() {
    console.log(
        'Opening PrOps Demo Platform...'
    )

    console.log(
        `Processing ${assessment.type.toUpperCase()} assessment in DEMO mode...`
    )

    const result = await runAssessment({
        assessment,

        // Visible, deliberately slowed
        // so viewers can follow the workflow.
        headless: false,
        slowMo: 250,

        // Keep final result visible.
        keepOpenMs: 5000,
    })

    console.log(
        '✓ Assessment successfully created'
    )

    if (result.platformId) {
        console.log(
            `Platform ID: ${result.platformId}`
        )
    }

    console.log(
        `Execution time: ${(result.executionMs / 1000).toFixed(2)} s`
    )
}

run().catch((error) => {
    console.error('Demo failed:')
    console.error(error)
    process.exit(1)
})