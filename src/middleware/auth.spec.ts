// Local Dependencies
import { Request, Response } from '../interfaces'
import { models } from '../db'
import { requireAuth } from './auth'

jest.mock('../db', () => {
  return {
    models: {
      Users: {
        findOne: jest.fn(),
      },
      Sessions: {
        findOne: jest.fn(),
      },
    },
  }
})

describe('middleware: auth', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(() => {
    jest.resetAllMocks()
  })

  describe('#requireAuth', () => {
    describe('with a valid auth token', () => {
      const authToken = 'mock token'
      const userId = 'mock user id'
      const session = { userId, authToken }
      const user = { id: userId }

      let req: Partial<Request>
      let res: Partial<Response>
      let next: any

      beforeEach(() => {
        req = {
          headers: {
            authorization: authToken,
          },
        }
        res = {}
        next = jest.fn()

        models.Sessions.findOne = jest.fn(() => session)
        models.Users.findOne = jest.fn(() => user)
      })

      it('adds the current user to the Request', async () => {
        await requireAuth(req as Request, res as Response, next)

        // assert `session`
        const findSession: any = models.Sessions.findOne
        expect(findSession.mock.calls.length).toEqual(1)
        expect(findSession.mock.calls[0][0]).toEqual({
          where: { authToken: session.authToken },
        })

        // assert `user`
        const findUser: any = models.Users.findOne
        expect(findUser.mock.calls.length).toEqual(1)
        expect(findUser.mock.calls[0][0]).toEqual({
          where: { id: session.userId },
        })

        // assert `req`
        expect(req.currentUser).toEqual(user)

        // assert `next`
        expect(next.mock.calls.length).toEqual(1)
      })
    })

    describe('with an invalid auth token', () => {
      const authToken = 'mock token'
      const userId = 'mock user id'
      const session = { userId, authToken }

      let req: Partial<Request>
      let res: Partial<Response>
      let next: any

      beforeEach(() => {
        req = {
          headers: {
            authorization: authToken,
          },
        }

        const status = jest.fn(() => ({ json }))
        const json = jest.fn()
        res = { status, json }
        next = jest.fn()
      })

      describe('and an unknown session', () => {
        beforeEach(() => {
          models.Sessions.findOne = jest.fn()
          models.Users.findOne = jest.fn()
        })

        it('returns a 404', async () => {
          await requireAuth(req as Request, res as Response, next)

          // assert `session`
          const findSession: any = models.Sessions.findOne
          expect(findSession.mock.calls.length).toEqual(1)
          expect(findSession.mock.calls[0][0]).toEqual({
            where: { authToken: session.authToken },
          })

          // assert `user`
          const findUser: any = models.Users.findOne
          expect(findUser.mock.calls.length).toEqual(0)

          // assert `req`
          expect(req.currentUser).toBeUndefined()

          // assert `res`
          const status: any = res.status
          expect(status.mock.calls.length).toEqual(1)
          expect(status.mock.calls[0][0]).toEqual(401)

          // assert `next`
          expect(next.mock.calls.length).toEqual(0)
        })
      })

      describe('and an unknown user', () => {
        beforeEach(() => {
          models.Sessions.findOne = jest.fn(() => session)
          models.Users.findOne = jest.fn()
        })

        it('returns a 404', async () => {
          await requireAuth(req as Request, res as Response, next)

          // assert `session`
          const findSession: any = models.Sessions.findOne
          expect(findSession.mock.calls.length).toEqual(1)
          expect(findSession.mock.calls[0][0]).toEqual({
            where: { authToken: session.authToken },
          })

          // assert `user`
          const findUser: any = models.Users.findOne
          expect(findUser.mock.calls.length).toEqual(1)
          expect(findUser.mock.calls[0][0]).toEqual({
            where: { id: session.userId },
          })

          // assert `req`
          expect(req.currentUser).toBeUndefined()

          // assert `res`
          const status: any = res.status
          expect(status.mock.calls.length).toEqual(1)
          expect(status.mock.calls[0][0]).toEqual(401)

          // assert `next`
          expect(next.mock.calls.length).toEqual(0)
        })
      })
    })
  })
})

