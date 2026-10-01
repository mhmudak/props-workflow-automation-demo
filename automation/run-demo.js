const { chromium } = require('playwright')
const fs = require('fs')
const path = require('path')

const dataPath = path.join(
  __dirname,
  'data',
  'sample-question.json'
)

const question = JSON.parse(
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

  console.log('Opening PrOps Demo Platform...')

  await page.goto('http://localhost:5173', {
    waitUntil: 'networkidle',
  })

  console.log('Creating assessment...')

  await page.locator('#question').fill(question.questionText)

  for (const answer of question.answers) {
    await page
      .locator(`#answer${answer.label}`)
      .fill(answer.text)
  }

  const correctAnswer = question.answers.find(
    (answer) => answer.correct
  )

  if (!correctAnswer) {
    throw new Error('No correct answer defined.')
  }

  await page
    .locator('#correctAnswer')
    .selectOption(correctAnswer.label)

  await page.locator('#hint').fill(question.hint)

  await page
    .locator('#feedback')
    .fill(question.generalFeedback)

  await page
    .locator('#difficulty')
    .selectOption({
      label: question.metadata.difficulty,
    })

  await page
    .locator('#dok')
    .selectOption(question.metadata.dok)

  await page
    .locator('#grade')
    .fill(question.metadata.grade)

  await page
    .locator('#keywords')
    .fill(question.metadata.keywords.join(', '))

  await page
    .locator('#learningOutcome')
    .fill(question.learningOutcome)

  await page.locator('#saveAssessment').click()

  await page.locator('#saveSuccess').waitFor({
    state: 'visible',
  })

  console.log('✓ Assessment successfully created')

  await page.waitForTimeout(5000)

  await browser.close()
}

run().catch((error) => {
  console.error('Automation failed:')
  console.error(error)
  process.exit(1)
})