const fs = require('fs')
const path = require('path')

const {
    runAssessment,
} = require(
    '../src/runtime/assessment-runner'
)

const {
    ExecutionStateStore,
} = require(
    '../src/execution/execution-state-store'
)

const {
    ExecutionManager,
} = require(
    '../src/execution/execution-manager'
)

const dataPath = path.join(
    __dirname,
    '..',
    'data',
    'sample-question.json'
)

const statePath = path.join(
    __dirname,
    '..',
    'state',
    'execution-state.json'
)

const assessment = JSON.parse(
    fs.readFileSync(
        dataPath,
        'utf8'
    )
)

const stateStore =
    new ExecutionStateStore(
        statePath
    )

const executionManager =
    new ExecutionManager({
        stateStore,
    })

async function run() {
    if (
        executionManager.shouldSkip(
            assessment.sourceId
        )
    ) {
        console.log(
            `SKIPPED: ${assessment.sourceId} is already completed.`
        )

        return
    }

    console.log(
        `Starting ${assessment.sourceId}...`
    )

    executionManager.startAttempt(
        assessment
    )

    try {
        const result =
            await runAssessment({
                assessment,
                headless: false,
                slowMo: 0,
                keepOpenMs: 2000,
            })

        executionManager.completeAttempt(
            assessment,
            {
                executionMs:
                    result.executionMs,

                // Our demo platform currently
                // has no persistent record ID.
                platformId:
                    result.platformId,
            }
        )

        console.log(
            `COMPLETED: ${assessment.sourceId}`
        )
    } catch (error) {
        executionManager.failAttempt(
            assessment,
            error
        )

        console.error(
            `FAILED: ${assessment.sourceId}`
        )

        throw error
    }
}

run().catch((error) => {
    console.error(error)
    process.exit(1)
})