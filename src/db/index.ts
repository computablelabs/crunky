// Dependencies
import Sequelize from 'sequelize'

const isProd: boolean = process.env.NODE_ENV === 'production'
const databaseName: string = isProd ? 'computable' : 'computable_dev'
const username: string = process.env.DB_USERNAME as string
const password: string = process.env.DB_PASSWORD as string
const host: string = process.env.DB_HOST as string

// @ts-ignore TS2351
const sequelize = new Sequelize(databaseName, username, password, {
  host,
  dialect: 'postgres',
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
