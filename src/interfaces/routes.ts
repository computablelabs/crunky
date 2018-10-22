// Dependencies
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express'

// Local Dependencies
import { UserInstance } from '.'

interface Request extends ExpressRequest {
  metaAuth?: any
  currentUser?: UserInstance
}

export {
  Request,
  ExpressResponse as Response,
}

