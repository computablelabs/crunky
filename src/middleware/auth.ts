// Local Dependencies
import { Request, Response } from '../interfaces'
import { models } from '../db'

const requireAuth = async (req: Request, res: Response, next: Function) => {
  const { Sessions, Users } = models

  // Get auth token from request
  const authHeader = 'authorization'
  const authToken = req.headers[authHeader]

  // Find session associated w/ auth token
  const session = await Sessions.findOne({
    where: {
      authToken,
    },
  })

  if (!session) {
    res.status(401)
      .json({ error: 'User is not authorized' })

    return
  }

  // Find user associated w/ session
  const user = await Users.findOne({
    where: {
      id: session.userId,
    },
  })

  if (!user) {
    res.status(401)
      .json({ error: 'User is not authorized' })

    return
  }

  // Pass current user along w/ request
  req.currentUser = user

  next()
}

export { requireAuth }

