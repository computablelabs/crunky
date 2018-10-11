// Dependencies
import { isCelebrate } from 'celebrate'

// Local Dependencies
import { Map, Request, Response } from '../interfaces'

const paramValidationErrors = (err: Map, req: Request, res: Response, next: Function) => {
  if (!isCelebrate(err)) {
    next(err)
  }

  const messageTokens = err.message.match(/\[(.*)\]/)
  const message = messageTokens ? messageTokens[1] : err.message

  const error = {
    statusCode: 400,
    error: 'Bad Request',
    message,
  }

  next(error)
}

const unhandledErrors = (err: Map, req: Request, res: Response, next: Function) => {
  if (err.statusCode) {
    next(err)
  }

  const error = {
    statusCode: 500,
    error: 'Internal Server Error',
    message: err.message,
  }

  next(error)
}

const errors = (err: any, req: Request, res: Response, next: Function) => {
  if (!err) {
    next()
  }

  res.status(err.statusCode)
    .json(err)
}

export { paramValidationErrors, unhandledErrors, errors }

