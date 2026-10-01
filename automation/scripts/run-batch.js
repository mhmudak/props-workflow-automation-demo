const fs = require('fs')
const path = require('path')

const {
  createAssessmentSession,
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

const {
  validateBatch,
} = require(
  '../src/execution/batch-validator'
)

const {
  getExecutionPolicy,
} = require(
  '../src/execution/execution-policy'
)

const dataPath = path.join(
  __dirname,
  '..',
  'data',
  'sample-batch.json'
)

const statePath = path.join(
  __dirname,
  '..',
  'state',
  'execution-state.json'
)

const assessments =
  JSON.parse(
    fs.readFileSync(
      dataPath,
      'utf8'
    )
  )

const policy =
  getExecutionPolicy(
    process.argv[2]
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
  //
  // PRE-FLIGHT
  //
  // Nothing is sent to the target
  // platform before the complete
  // batch passes validation.
  //
  validateBatch(
    assessments
  )

  console.log('')
  console.log(
    'PrOps Batch Execution'
  )

  console.log(
    '--------------------------'
  )

  console.log(
    `Items       : ${assessments.length}`
  )

  console.log(
    `Policy      : ${policy.name}`
  )

  console.log(
    'Preflight   : PASS'
  )

  console.log(
    '--------------------------'
  )

  let completed = 0
  let skipped = 0
  let failed = 0
  let reached = 0

  let haltedAt = null
  let session = null

  try {
    for (
      const assessment
      of assessments
    ) {
      const {
        sourceId,
      } = assessment

      if (
        executionManager.shouldSkip(
          sourceId
        )
      ) {
        skipped += 1
        reached += 1

        console.log(
          `SKIPPED   ${sourceId}`
        )

        continue
      }

      //
      // Lazy session creation:
      // if every item is already
      // completed, Chrome never opens.
      //
      if (!session) {
        session =
          await createAssessmentSession({
            headless: false,
            slowMo: 0,
          })
      }

      console.log(
        `STARTING  ${sourceId}`
      )

      executionManager.startAttempt(
        assessment
      )

      try {
        const result =
          await session.runAssessment({
            assessment,
            keepOpenMs: 0,
          })

        executionManager.completeAttempt(
          assessment,
          {
            executionMs:
              result.executionMs,

            platformId: null,
          }
        )

        completed += 1
        reached += 1

        console.log(
          `COMPLETED ${sourceId}`
        )
      } catch (error) {
        executionManager.failAttempt(
          assessment,
          error
        )

        failed += 1
        reached += 1

        console.error(
          `FAILED    ${sourceId}`
        )

        console.error(
          `          ${error.message}`
        )

        if (
          policy.haltOnError
        ) {
          haltedAt =
            sourceId

          console.error(
            'HALTED    Execution order must be preserved.'
          )

          break
        }
      }
    }
  } finally {
    if (session) {
      await session.close()
    }
  }

  const notReached =
    assessments.length -
    reached

  console.log('')
  console.log(
    'Batch Summary'
  )

  console.log(
    '--------------------------'
  )

  console.log(
    `Total       : ${assessments.length}`
  )

  console.log(
    `Completed   : ${completed}`
  )

  console.log(
    `Skipped     : ${skipped}`
  )

  console.log(
    `Failed      : ${failed}`
  )

  console.log(
    `Not reached : ${notReached}`
  )

  if (haltedAt) {
    console.log(
      `Halted at   : ${haltedAt}`
    )
  }

  console.log(
    `Policy      : ${policy.name}`
  )

  console.log(
    '--------------------------'
  )

  if (failed > 0) {
    process.exitCode = 1
  }
}

run().catch(
  (error) => {
    console.error('')
    console.error(
      'Batch execution failed:'
    )

    console.error(
      error.message ??
      error
    )

    process.exit(1)
  }
)