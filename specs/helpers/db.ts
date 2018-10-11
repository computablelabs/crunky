// Local Dependencies
import { models } from '../../src/db'

const clearDatabase = async (done: Function = () => {}) => {
  const actions = Object.keys(models).map((modelName) => {
    const model = models[modelName]

    if (!model.destroy) {
      return undefined
    }

    return model.destroy({ where: {}, force: true, logging: false })
  }).filter((item) => !!item)

  return Promise.all(actions)
    .then(() => done())
}

export { clearDatabase }

