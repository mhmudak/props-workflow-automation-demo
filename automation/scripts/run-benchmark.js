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
  console.log('')
  console.log('PrOps Automation Benchmark')
  console.log('--------------------------')

  const result = await runAssessment({
    assessment,

    // No visual delay.
    headless: true,
    slowMo: 0,
    keepOpenMs: 0,
  })

  console.log(
    `Assessment type : ${assessment.type.toUpperCase()}`
  )

  console.log(
    `Execution time  : ${(result.executionMs / 1000).toFixed(3)} s`
  )

  console.log(
    `Status          : ${result.success ? 'SUCCESS' : 'FAILED'}`
  )

  console.log('--------------------------')
  console.log('')
}

run().catch((error) => {
  console.error('')
  console.error('Benchmark failed:')
  console.error(error)
  console.error('')

  process.exit(1)
})