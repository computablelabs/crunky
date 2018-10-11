// Dependencies
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import logger from 'morgan'

// Local Dependencies
import { paramValidationErrors, unhandledErrors, errors } from './middleware'
import * as Routers from './router'

class App {
  public app: express.Application

  constructor() {
    // @ts-ignore TS2349
    this.app = express()
    this.configureMiddleware()
    this.configureRoutes()
  }

  private configureMiddleware(): void {
    // server logging middleware
    // @ts-ignore TS2349
    this.app.use(logger('dev'))

    // support application/json type post data
    this.app.use(bodyParser.json())

    //support application/x-www-form-urlencoded post data
    this.app.use(bodyParser.urlencoded({ extended: false }))

    // enable CORS headers
    this.app.use(cors())
  }

  private configureRoutes(): void {
    Object.values(Routers).forEach((router) => {
      router(this.app)
    })

    // error handling middleware | must come after routes
    this.app.use(paramValidationErrors)
    this.app.use(unhandledErrors)
    this.app.use(errors)
  }
}

const app = new App().app

export default app

