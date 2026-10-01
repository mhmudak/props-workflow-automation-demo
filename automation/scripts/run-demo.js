const { chromium } = require('playwright')
const fs = require('fs')
const path = require('path')

const {
  PrOpsDemoAdapter,
} = require('../src/adapters/props-demo.adapter')

const {
  processAssessment,
} = require('../src/engine/assessment-engine')

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
  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    slowMo: 250,
  })

  const page = await browser.newPage({
    viewport: {
      width: 1440,
      height: 1000,
    },
  })

  try {
    console.log(
      'Opening PrOps Demo Platform...'
    )

    const adapter =
      new PrOpsDemoAdapter(page)

    await adapter.open()

    console.log(
      `Processing ${assessment.type.toUpperCase()} assessment...`
    )

    await processAssessment(
      assessment,
      adapter
    )

    console.log(
      '✓ Assessment successfully created'
    )

    await page.waitForTimeout(5000)
  } finally {
    await browser.close()
  }
}

run().catch((error) => {
  console.error('Automation failed:')
  console.error(error)

  process.exit(1)
})