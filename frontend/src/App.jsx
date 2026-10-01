import { useState } from 'react'
import './App.css'

const initialForm = {
  question: '',
  answerA: '',
  answerB: '',
  answerC: '',
  answerD: '',
  correctAnswer: 'A',
  hint: '',
  feedback: '',
  difficulty: 'Medium',
  dok: '2',
  grade: '4',
  keywords: '',
  learningOutcome: '',
}

function App() {
  const [form, setForm] = useState(initialForm)
  const [saved, setSaved] = useState(false)

  const updateField = (event) => {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))

    setSaved(false)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setSaved(true)
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <div className="brand">
            Pr<span>Ops</span>
          </div>

          <div className="brand-subtitle">
            Workflow Automation Engineering
          </div>
        </div>

        <div className="demo-badge">DEMO ENVIRONMENT</div>
      </header>

      <main className="page">
        <section className="page-heading">
          <div>
            <p className="eyebrow">ASSESSMENT AUTOMATION DEMO</p>

            <h1>Create Assessment</h1>

            <p className="description">
              A neutral PrOps authoring environment built to demonstrate
              automated assessment creation.
            </p>
          </div>

          <div className="status-chip">
            <span className="status-dot" />
            Ready for automation
          </div>
        </section>

        <form onSubmit={handleSubmit}>
          <div className="layout">
            <section className="card main-card">
              <div className="section-title">
                <span className="step-number">1</span>

                <div>
                  <h2>Question Content</h2>
                  <p>Enter the assessment question and answer choices.</p>
                </div>
              </div>

              <div className="field">
                <label htmlFor="question">Question</label>

                <textarea
                  id="question"
                  name="question"
                  value={form.question}
                  onChange={updateField}
                  placeholder="Enter assessment question..."
                  rows="4"
                />
              </div>

              <div className="answers-grid">
                {['A', 'B', 'C', 'D'].map((letter) => {
                  const fieldName = `answer${letter}`

                  return (
                    <div className="field" key={letter}>
                      <label htmlFor={fieldName}>
                        Answer {letter}
                      </label>

                      <div className="answer-field">
                        <span>{letter}</span>

                        <input
                          id={fieldName}
                          name={fieldName}
                          value={form[fieldName]}
                          onChange={updateField}
                          placeholder={`Enter answer ${letter}`}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="field">
                <label htmlFor="correctAnswer">Correct Answer</label>

                <select
                  id="correctAnswer"
                  name="correctAnswer"
                  value={form.correctAnswer}
                  onChange={updateField}
                >
                  <option value="A">A — Answer A</option>
                  <option value="B">B — Answer B</option>
                  <option value="C">C — Answer C</option>
                  <option value="D">D — Answer D</option>
                </select>
              </div>

              <div className="divider" />

              <div className="section-title compact">
                <span className="step-number">2</span>

                <div>
                  <h2>Guidance & Feedback</h2>
                  <p>Add learner support and response feedback.</p>
                </div>
              </div>

              <div className="field">
                <label htmlFor="hint">Hint</label>

                <textarea
                  id="hint"
                  name="hint"
                  value={form.hint}
                  onChange={updateField}
                  placeholder="Enter hint..."
                  rows="3"
                />
              </div>

              <div className="field">
                <label htmlFor="feedback">General Feedback</label>

                <textarea
                  id="feedback"
                  name="feedback"
                  value={form.feedback}
                  onChange={updateField}
                  placeholder="Enter general feedback..."
                  rows="3"
                />
              </div>
            </section>

            <aside className="side-column">
              <section className="card">
                <div className="section-title compact">
                  <span className="step-number">3</span>

                  <div>
                    <h2>Metadata</h2>
                    <p>Configure assessment attributes.</p>
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="difficulty">Difficulty</label>

                  <select
                    id="difficulty"
                    name="difficulty"
                    value={form.difficulty}
                    onChange={updateField}
                  >
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                  </select>
                </div>

                <div className="field">
                  <label htmlFor="dok">Depth of Knowledge</label>

                  <select
                    id="dok"
                    name="dok"
                    value={form.dok}
                    onChange={updateField}
                  >
                    <option value="1">DOK 1</option>
                    <option value="2">DOK 2</option>
                    <option value="3">DOK 3</option>
                    <option value="4">DOK 4</option>
                  </select>
                </div>

                <div className="field">
                  <label htmlFor="grade">Grade</label>

                  <input
                    id="grade"
                    name="grade"
                    value={form.grade}
                    onChange={updateField}
                    placeholder="Grade"
                  />
                </div>

                <div className="field">
                  <label htmlFor="keywords">Keywords</label>

                  <input
                    id="keywords"
                    name="keywords"
                    value={form.keywords}
                    onChange={updateField}
                    placeholder="planets, science"
                  />
                </div>
              </section>

              <section className="card">
                <div className="section-title compact">
                  <span className="step-number">4</span>

                  <div>
                    <h2>Learning Outcome</h2>
                    <p>Map the assessment to its objective.</p>
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="learningOutcome">
                    Learning Outcome
                  </label>

                  <input
                    id="learningOutcome"
                    name="learningOutcome"
                    value={form.learningOutcome}
                    onChange={updateField}
                    placeholder="e.g. SCI.4.2.1"
                  />
                </div>
              </section>

              <section className="card automation-card">
                <p className="automation-label">AUTOMATION STATUS</p>

                <div className="automation-row">
                  <span>Input validation</span>
                  <strong>Ready</strong>
                </div>

                <div className="automation-row">
                  <span>Authoring engine</span>
                  <strong>Ready</strong>
                </div>

                <div className="automation-row">
                  <span>QA verification</span>
                  <strong>Ready</strong>
                </div>
              </section>
            </aside>
          </div>

          <div className="save-panel">
            <div>
              <strong>Assessment Configuration</strong>

              <p>
                Complete the fields above, then save the assessment.
              </p>
            </div>

            <button id="saveAssessment" type="submit">
              Save Assessment
            </button>
          </div>

          {saved && (
            <div
              id="saveSuccess"
              className="success-message"
              role="status"
            >
              <span>✓</span>

              <div>
                <strong>Assessment successfully created</strong>
                <p>
                  The assessment passed validation and was saved successfully.
                </p>
              </div>
            </div>
          )}
        </form>
      </main>

      <footer>
        <strong>PrOps</strong>
        <span>Workflow Automation Engineering</span>
        <span>by 3A · Saida, Lebanon</span>
      </footer>
    </div>
  )
}

export default App