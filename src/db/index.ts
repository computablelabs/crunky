// Dependencies
import Sequelize from 'sequelize'

// Local Dependencies
import * as config from './config'
import {
  UserFactory,
  SessionFactory,
} from './models'

const env = process.env.NODE_ENV || 'development'
const isTestEnv = env === 'test'

// @ts-ignore TS2351
const sequelize = new Sequelize({
  ...config[env],
  timezone: 'utc',
  operatorsAliases: false,
  logging: !isTestEnv,

  pool: {
    max: 5,
    min: 0,
    acquire: 30 * 1000,
    idle: 10 * 1000,
  },
})

sequelize.authenticate()
  .then(() => {
    if (!isTestEnv) {
      console.log('database connection successful')
    }
  })
  .catch((err: Error) => {
    console.log('database connection error: ', err.toString())
  })

const models = {
  Users: UserFactory(sequelize),
  Sessions: SessionFactory(sequelize),
}

Object.values(models).forEach((model: any) => {
  if (model.associate) {
    model.associate(models)
  }
})

export {
  sequelize,
  Sequelize,
  models,
}

