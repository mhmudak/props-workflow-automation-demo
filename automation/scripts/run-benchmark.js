const fs = require('fs')
const path = require('path')

const {
  runAssessment,
} = require('../src/runtime/assessment-runner')

const DEFAULT_ITERATIONS = 10
const MAX_ITERATIONS = 100

const dataPath = path.join(
  __dirname,
  '..',
  'data',
  'sample-question.json'
)

const assessment = JSON.parse(
  fs.readFileSync(dataPath, 'utf8')
)

function getIterations() {
  const requested = process.argv[2]

  if (!requested) {
    return DEFAULT_ITERATIONS
  }

  const iterations = Number.parseInt(
    requested,
    10
  )

  if (
    !Number.isInteger(iterations) ||
    iterations < 1 ||
    iterations > MAX_ITERATIONS
  ) {
    throw new Error(
      `Iterations must be between 1 and ${MAX_ITERATIONS}.`
    )
  }

  return iterations
}

function average(values) {
  return (
    values.reduce(
      (total, value) => total + value,
      0
    ) / values.length
  )
}

function median(values) {
  const sorted = [...values].sort(
    (a, b) => a - b
  )

  const middle = Math.floor(
    sorted.length / 2
  )

  if (sorted.length % 2 === 0) {
    return (
      sorted[middle - 1] +
      sorted[middle]
    ) / 2
  }

  return sorted[middle]
}

function formatSeconds(milliseconds) {
  return `${(milliseconds / 1000).toFixed(3)} s`
}

async function runOnce() {
  return runAssessment({
    assessment,
    headless: true,
    slowMo: 0,
    keepOpenMs: 0,
  })
}

async function run() {
  const iterations = getIterations()

  console.log('')
  console.log('PrOps Automation Benchmark')
  console.log('--------------------------')

  console.log(
    `Assessment type : ${assessment.type.toUpperCase()}`
  )

  console.log(
    `Iterations      : ${iterations}`
  )

  console.log(
    'Warm-up         : 1 run (excluded)'
  )

  console.log('--------------------------')
  console.log('')

  // Warm-up execution is deliberately excluded
  // from benchmark statistics.
  await runOnce()

  const timings = []
  let failures = 0

  for (
    let iteration = 1;
    iteration <= iterations;
    iteration += 1
  ) {
    try {
      const result = await runOnce()

      timings.push(result.executionMs)

      console.log(
        `Run ${String(iteration).padStart(2, '0')}/${iterations}` +
        `  ${formatSeconds(result.executionMs)}` +
        '  SUCCESS'
      )
    } catch (error) {
      failures += 1

      console.log(
        `Run ${String(iteration).padStart(2, '0')}/${iterations}` +
        '  FAILED'
      )

      console.error(error.message)
    }
  }

  if (timings.length === 0) {
    throw new Error(
      'All benchmark iterations failed.'
    )
  }

  const averageMs = average(timings)
  const medianMs = median(timings)
  const minimumMs = Math.min(...timings)
  const maximumMs = Math.max(...timings)

  console.log('')
  console.log('Benchmark Summary')
  console.log('--------------------------')

  console.log(
    `Successful      : ${timings.length}/${iterations}`
  )

  console.log(
    `Average         : ${formatSeconds(averageMs)}`
  )

  console.log(
    `Median          : ${formatSeconds(medianMs)}`
  )

  console.log(
    `Minimum         : ${formatSeconds(minimumMs)}`
  )

  console.log(
    `Maximum         : ${formatSeconds(maximumMs)}`
  )

  console.log(
    `Status          : ${failures === 0 ? 'PASS' : 'FAIL'}`
  )

  console.log('--------------------------')

  console.log(
    'Scope           : Local PrOps demo environment'
  )

  console.log(
    'Timing excludes : Browser startup and initial page load'
  )

  console.log('')

  if (failures > 0) {
    process.exitCode = 1
  }
}

run().catch((error) => {
  console.error('')
  console.error('Benchmark failed:')
  console.error(error)
  console.error('')

  process.exit(1)
})
