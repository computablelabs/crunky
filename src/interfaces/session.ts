// Dependencies
import { Instance } from 'sequelize'

interface SessionAttributes {
  id?: string
  userId: string
  authToken: string
  createdAt?: string
  updatedAt?: string
}

type SessionInstance = Instance<SessionAttributes> & SessionAttributes

interface SessionModel {}

export {
  SessionAttributes,
  SessionInstance,
  SessionModel,
}

