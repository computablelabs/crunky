// Dependencies
import { celebrate, Joi } from 'celebrate'

// Local Dependencies
import {
  signup,
  getChallenge,
  login,
} from '../controllers'

const routes = (app: any): void => {
  app.post('/signup', celebrate({
    body: {
      publicAddress: Joi.string().required(),
    },
  }), signup)

  app.get('/auth/:publicAddress', celebrate({
    params: {
      publicAddress: Joi.string().required(),
    },
  }), getChallenge)

  app.post('/auth/:challenge/:signature', celebrate({
    params: {
      challenge: Joi.string().required(),
      signature: Joi.string().required(),
    },
  }), login)
}

export default routes

