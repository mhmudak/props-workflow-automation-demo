class ExecutionManager {
  constructor({
    stateStore,
  }) {
    this.stateStore = stateStore
  }

  getState(sourceId) {
    return this.stateStore.get(
      sourceId
    )
  }

  shouldSkip(sourceId) {
    const state = this.getState(
      sourceId
    )

    return (
      state?.status === 'completed'
    )
  }

  startAttempt(assessment) {
    const { sourceId } = assessment

    if (!sourceId) {
      throw new Error(
        'Assessment sourceId is required.'
      )
    }

    return this.stateStore.update(
      sourceId,
      (current) => {
        const now =
          new Date().toISOString()

        const previousAttempts =
          current?.attempts ?? []

        return {
          sourceId,
          status: 'processing',

          attemptCount:
            previousAttempts.length + 1,

          platformId:
            current?.platformId ?? null,

          lastError: null,

          startedAt: now,
          completedAt: null,
          updatedAt: now,

          attempts: [
            ...previousAttempts,
            {
              attempt:
                previousAttempts.length +
                1,

              status: 'processing',
              startedAt: now,
              finishedAt: null,
              platformId: null,
              error: null,
            },
          ],
        }
      }
    )
  }

  completeAttempt(
    assessment,
    {
      platformId = null,
      executionMs = null,
    } = {}
  ) {
    const { sourceId } = assessment

    return this.stateStore.update(
      sourceId,
      (current) => {
        if (!current) {
          throw new Error(
            `No active execution state for ${sourceId}.`
          )
        }

        const now =
          new Date().toISOString()

        const attempts =
          [...current.attempts]

        const lastAttempt =
          attempts.at(-1)

        attempts[
          attempts.length - 1
        ] = {
          ...lastAttempt,
          status: 'completed',
          finishedAt: now,
          platformId,
          executionMs,
          error: null,
        }

        return {
          ...current,

          status: 'completed',

          platformId:
            platformId ??
            current.platformId,

          lastError: null,

          completedAt: now,
          updatedAt: now,

          attempts,
        }
      }
    )
  }

  failAttempt(
    assessment,
    error
  ) {
    const { sourceId } = assessment

    return this.stateStore.update(
      sourceId,
      (current) => {
        if (!current) {
          throw new Error(
            `No active execution state for ${sourceId}.`
          )
        }

        const now =
          new Date().toISOString()

        const attempts =
          [...current.attempts]

        const lastAttempt =
          attempts.at(-1)

        attempts[
          attempts.length - 1
        ] = {
          ...lastAttempt,
          status: 'failed',
          finishedAt: now,
          error:
            error?.message ??
            String(error),
        }

        return {
          ...current,

          status: 'failed',

          lastError:
            error?.message ??
            String(error),

          updatedAt: now,

          attempts,
        }
      }
    )
  }
}

module.exports = {
  ExecutionManager,
}