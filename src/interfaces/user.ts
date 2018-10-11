// Dependencies
import { Instance } from 'sequelize'

interface UserAttributes {
  id?: string
  publicAddress: string
  nonce: string
  createdAt?: string
  updatedAt?: string
}

type UserInstance = Instance<UserAttributes> & UserAttributes

interface UserModel {}

export {
  UserAttributes,
  UserInstance,
  UserModel,
}

