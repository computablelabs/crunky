// Dependencies
import { Request, Response } from 'express'

const getUsers = (req: Request, res: Response) => {
  res.status(200)
    .send({
      message: 'Success',
    })
}

export { getUsers }

