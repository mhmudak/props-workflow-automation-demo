function validateMcq(question) {
    if (!question.questionText) {
        throw new Error('MCQ is missing questionText.')
    }

    if (
        !Array.isArray(question.answers) ||
        question.answers.length !== 4
    ) {
        throw new Error(
            'MCQ must contain exactly four answers.'
        )
    }

    const correctAnswers = question.answers.filter(
        (answer) => answer.correct
    )

    if (correctAnswers.length !== 1) {
        throw new Error(
            'MCQ must contain exactly one correct answer.'
        )
    }

    if (!question.metadata) {
        throw new Error('MCQ metadata is missing.')
    }

    if (!question.learningOutcome) {
        throw new Error(
            'MCQ learningOutcome is missing.'
        )
    }
}

async function handleMcq(question, adapter) {
    validateMcq(question)

    await adapter.fillQuestion(
        question.questionText
    )

    for (const answer of question.answers) {
        await adapter.fillAnswer(
            answer.label,
            answer.text
        )
    }

    const correctAnswer = question.answers.find(
        (answer) => answer.correct
    )

    await adapter.selectCorrectAnswer(
        correctAnswer.label
    )

    await adapter.fillHint(question.hint)

    await adapter.fillFeedback(
        question.generalFeedback
    )

    await adapter.setDifficulty(
        question.metadata.difficulty
    )

    await adapter.setDok(
        question.metadata.dok
    )

    await adapter.setGrade(
        question.metadata.grade
    )

    await adapter.setKeywords(
        question.metadata.keywords
    )

    await adapter.setLearningOutcome(
        question.learningOutcome
    )

    await adapter.save()

    const platformResult =
        await adapter.waitForSaveSuccess()

    return platformResult
}

module.exports = {
    validateMcq,
    handleMcq,
}