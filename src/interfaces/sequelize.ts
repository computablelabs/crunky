// Dependencies
import {
  DataTypeAbstract,
  DefineAttributeColumnOptions,
} from 'sequelize'

type SequelizeAttributes<T extends { [key: string]: any }> = {
  [P in keyof T]: string|DataTypeAbstract|DefineAttributeColumnOptions
}

export { SequelizeAttributes }

