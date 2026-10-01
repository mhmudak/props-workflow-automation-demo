class PrOpsDemoAdapter {
  constructor(page) {
    this.page = page
  }

  async open() {
    await this.page.goto('http://localhost:5173', {
      waitUntil: 'networkidle',
    })
  }

  async fillQuestion(text) {
    await this.page.locator('#question').fill(text)
  }

  async fillAnswer(label, text) {
    await this.page
      .locator(`#answer${label}`)
      .fill(text)
  }

  async selectCorrectAnswer(label) {
    await this.page
      .locator('#correctAnswer')
      .selectOption(label)
  }

  async fillHint(text) {
    await this.page.locator('#hint').fill(text)
  }

  async fillFeedback(text) {
    await this.page.locator('#feedback').fill(text)
  }

  async setDifficulty(value) {
    await this.page
      .locator('#difficulty')
      .selectOption({ label: value })
  }

  async setDok(value) {
    await this.page
      .locator('#dok')
      .selectOption(value)
  }

  async setGrade(value) {
    await this.page
      .locator('#grade')
      .fill(String(value))
  }

  async setKeywords(keywords) {
    await this.page
      .locator('#keywords')
      .fill(keywords.join(', '))
  }

  async setLearningOutcome(value) {
    await this.page
      .locator('#learningOutcome')
      .fill(value)
  }

  async save() {
    await this.page
      .locator('#saveAssessment')
      .click()
  }

  async waitForSaveSuccess() {
    await this.page
      .locator('#saveSuccess')
      .waitFor({ state: 'visible' })
  }
}

module.exports = {
  PrOpsDemoAdapter,
}