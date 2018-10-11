// Dependencies
import UUID from 'uuid/v4'

// Local Dependencies
import { Request, Response } from '../interfaces'
import { isSignatureValid, generateJwtToken } from '../helpers'
import { models } from '../db'

const signup = async (req: Request, res: Response, next: Function) => {
  const { Users } = models
  const { publicAddress } = req.body

  try {
    const user = await Users.create({
      publicAddress,
      nonce: UUID().replace(/-/g, ''),
    })

    res.status(201)
      .json({ data: user })
  } catch (err) {
    next(err)
  }
}

const getChallenge = async (req: Request, res: Response, next: Function) => {
  const { Users } = models

  try {
    const user = await Users.findOne({
      where: {
        publicAddress: req.params.publicAddress,
      },
    })

    if (!user) {
      // TODO should we return a fake challenge to hide our registered users?
      const error = {
        statusCode: 404,
        error: 'Not Found',
        message: 'Unable to generate challenge',
      }

      return next(error)
    }

    res.status(200)
      .json({
        data: { challenge: user.nonce },
      })
  } catch (err) {
    next(err)
  }
}

const login = async (req: Request, res: Response, next: Function) => {
  const { Users, Sessions } = models
  const { challenge, signature } = req.params

  const genericError = {
    statusCode: 500,
    error: 'Internal Server Error',
    message: 'Unable to log in',
  }

  try {
    const user = await Users.findOne({
      where: {
        nonce: challenge,
      },
    })

    if (!user) {
      return next(genericError)
    }

    const isSigValid = isSignatureValid({
      publicAddress: user.publicAddress,
      nonce: user.nonce,
      signature,
    })

    if (!isSigValid) {
      return next(genericError)
    }

    const session = await Sessions.create({
      userId: user.id,
      authToken: generateJwtToken(user.id),
    })

    Users.update({
      nonce: UUID().replace(/-/g, ''),
    }, {
      where: { id: user.id },
    })

    res.status(201)
      .json({
        data: { token: session.authToken },
      })
  } catch (err) {
    next(err)
  }
}

export { getChallenge, signup, login }

