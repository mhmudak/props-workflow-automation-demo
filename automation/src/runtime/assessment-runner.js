const { chromium } = require('playwright')

const {
  PrOpsDemoAdapter,
} = require('../adapters/props-demo.adapter')

const {
  processAssessment,
} = require('../engine/assessment-engine')

async function createAssessmentSession({
  headless = false,
  slowMo = 0,
} = {}) {
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

  const adapter =
    new PrOpsDemoAdapter(page)

  async function runAssessmentInSession({
    assessment,
    keepOpenMs = 0,
  }) {
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
      await page.waitForTimeout(
        keepOpenMs
      )
    }

    return {
      success: true,
      executionMs,
    }
  }

  async function close() {
    await browser.close()
  }

  return {
    runAssessment:
      runAssessmentInSession,

    close,
  }
}

async function runAssessment({
  assessment,
  headless = false,
  slowMo = 0,
  keepOpenMs = 0,
}) {
  const session =
    await createAssessmentSession({
      headless,
      slowMo,
    })

  try {
    return await session.runAssessment({
      assessment,
      keepOpenMs,
    })
  } finally {
    await session.close()
  }
}

module.exports = {
  createAssessmentSession,
  runAssessment,
}