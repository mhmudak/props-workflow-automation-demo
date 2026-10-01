const { chromium } = require('playwright')

const {
  PrOpsDemoAdapter,
} = require('../adapters/props-demo.adapter')

const {
  processAssessment,
} = require('../engine/assessment-engine')

async function runAssessment({
  assessment,
  headless = false,
  slowMo = 0,
  keepOpenMs = 0,
}) {
  const browser = await chromium.launch({
    headless,
    channel: 'chrome',
    slowMo,
  })

  const page = await browser.newPage({
    viewport: {
      width: 1440,
      height: 1000,
    },
  })

  try {
    const adapter = new PrOpsDemoAdapter(page)

    await adapter.open()

    const startedAt = performance.now()

    await processAssessment(
      assessment,
      adapter
    )

    const finishedAt = performance.now()

    const executionMs =
      finishedAt - startedAt

    if (keepOpenMs > 0) {
      await page.waitForTimeout(keepOpenMs)
    }

    return {
      success: true,
      executionMs,
    }
  } finally {
    await browser.close()
  }
}

module.exports = {
  runAssessment,
}