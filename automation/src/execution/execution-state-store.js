const fs = require('fs')
const path = require('path')

class ExecutionStateStore {
  constructor(filePath) {
    this.filePath = filePath
  }

  load() {
    if (!fs.existsSync(this.filePath)) {
      return {
        version: 1,
        items: {},
      }
    }

    const raw = fs.readFileSync(
      this.filePath,
      'utf8'
    )

    if (!raw.trim()) {
      return {
        version: 1,
        items: {},
      }
    }

    return JSON.parse(raw)
  }

  save(state) {
    const directory = path.dirname(
      this.filePath
    )

    fs.mkdirSync(directory, {
      recursive: true,
    })

    fs.writeFileSync(
      this.filePath,
      JSON.stringify(state, null, 2),
      'utf8'
    )
  }

  get(sourceId) {
    const state = this.load()

    return state.items[sourceId] ?? null
  }

  update(sourceId, updater) {
    const state = this.load()

    const current =
      state.items[sourceId] ?? null

    state.items[sourceId] = updater(
      current
    )

    this.save(state)

    return state.items[sourceId]
  }
}

module.exports = {
  ExecutionStateStore,
}