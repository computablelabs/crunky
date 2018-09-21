// Dependencies
import Sequelize from 'sequelize'

// Local Dependencies
import * as config from './config'

const env = process.env.NODE_ENV || 'development'

// @ts-ignore TS2351
const sequelize = new Sequelize({
  ...config[env],
  operatorsAliases: false,

  pool: {
    max: 5,
    min: 0,
    acquire: 30 * 1000,
    idle: 10 * 1000,
  },
})

sequelize.authenticate()
  .then(() => {
    console.log('database connection successful')
  })
  .catch((err: Error) => {
    console.log('database connection error: ', err.toString())
  })

const models = {}

Object.values(models).forEach((model: any) => {
  if (model.associate) {
    model.associate(sequelize)
  }
})

export {
  sequelize,
  Sequelize,
  models,
}

