// Dependencies
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express'

interface Request extends ExpressRequest {
  metaAuth?: any
}

export {
  Request,
  ExpressResponse as Response,
}

