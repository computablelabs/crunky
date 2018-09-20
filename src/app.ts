// Dependencies
import express from 'express'
import bodyParser from 'body-parser'
import logger from 'morgan'

// Local Dependencies
import { UserRouter } from './router'

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
  }

  private configureRoutes(): void {
    UserRouter(this.app)
  }
}

const app = new App().app

export default app

