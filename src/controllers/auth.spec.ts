// Local Dependencies
import { Request, Response } from '../interfaces'
import { models } from '../db'
import {
  signup,
  getChallenge,
  login,
} from './auth'

jest.mock('../db', () => {
  return {
    models: {
      Users: {
        find: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      Sessions: {
        find: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
    },
  }
})

jest.mock('../helpers', () => {
  return {
    isSignatureValid: jest.fn(() => true),
    generateJwtToken: jest.fn(() => 'mock token'),
  }
})

describe('auth controller', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(() => {
    jest.resetAllMocks()
  })

  describe('#signup', () => {
    describe('with valid parameters', () => {
      it('returns a 200 status', async () => {
        const mockAddress = 'mock address'
        const req: Partial<Request> = {
          body: { publicAddress: mockAddress },
        }

        const status = jest.fn(() => res)
        const json = jest.fn()
        const res: Partial<Response> = {
          status,
          json,
        }

        await signup(req as Request, res as Response, () => {})

        expect(status.mock.calls.length).toEqual(1)
        expect(status.mock.calls[0][0]).toEqual(201)
      })

      it('creates a new user', async () => {
        const newUser = 'new user'
        models.Users.create = jest.fn(() => 'new user')

        const mockAddress = 'mock address'
        const req: Partial<Request> = {
          body: { publicAddress: mockAddress },
        }

        const status = jest.fn(() => res)
        const json = jest.fn()
        const res: Partial<Response> = {
          status,
          json,
        }

        await signup(req as Request, res as Response, () => {})

        const usersCreate: any = models.Users.create
        expect(usersCreate.mock.calls.length).toEqual(1)
        expect(usersCreate.mock.calls[0][0].publicAddress).toEqual(mockAddress)
        expect(usersCreate.mock.calls[0][0].nonce.length).toEqual(32)

        expect(json.mock.calls.length).toEqual(1)
        expect(json.mock.calls[0][0]).toEqual({ data: newUser })
      })
    })
  })

  describe('#getChallenge', () => {
    describe('with valid parameters', () => {
      it('returns a 200 status', async () => {
        const mockAddress = 'mock address'
        const mockChallenge = 'mock challenge'

        models.Users.findOne = jest.fn(() => ({ nonce: mockChallenge }))

        const req: Partial<Request> = {
          params: { publicAddress: mockAddress },
        }

        const status = jest.fn(() => res)
        const json = jest.fn()
        const res: Partial<Response> = {
          status,
          json,
        }

        await getChallenge(req as Request, res as Response, () => {})

        expect(status.mock.calls.length).toEqual(1)
        expect(status.mock.calls[0][0]).toEqual(200)
      })

      it('returns the challenge value provided by meta auth', async () => {
        const mockAddress = 'mock address'
        const mockChallenge = 'mock challenge'

        models.Users.findOne = jest.fn(() => ({ nonce: mockChallenge }))

        const req: Partial<Request> = {
          params: { publicAddress: mockAddress },
        }

        const status = jest.fn(() => res)
        const json = jest.fn()
        const res: Partial<Response> = {
          status,
          json,
        }

        await getChallenge(req as Request, res as Response, () => {})

        const usersFind: any = models.Users.findOne
        expect(usersFind.mock.calls.length).toEqual(1)
        expect(usersFind.mock.calls[0][0]).toEqual({
          where: { publicAddress: mockAddress },
        })

        expect(json.mock.calls.length).toEqual(1)
        expect(json.mock.calls[0][0]).toEqual({
          data: { challenge: mockChallenge },
        })
      })
    })
  })

  describe('#login', () => {
    describe('with valid parameters', () => {
      it('returns a 200 status', async () => {
        const mockUserId = 'mock user id'
        const mockChallenge = 'mock challenge'
        const mockSignature = 'mock signature'
        const mockAuthToken = 'mock token'

        models.Users.findOne = jest.fn(() => ({ id: mockUserId, nonce: mockChallenge }))
        models.Sessions.create = jest.fn(() => ({ authToken: mockAuthToken }))

        const req: Partial<Request> = {
          params: {
            challenge: mockChallenge,
            signature: mockSignature,
          },
        }

        const status = jest.fn(() => res)
        const json = jest.fn()
        const res: Partial<Response> = {
          status,
          json,
        }

        await login(req as Request, res as Response, () => {})

        expect(status.mock.calls.length).toEqual(1)
        expect(status.mock.calls[0][0]).toEqual(201)
      })

      it('returns a valid auth token', async () => {
        const mockUserId = 'mock user id'
        const mockChallenge = 'mock challenge'
        const mockSignature = 'mock signature'
        const mockAuthToken = 'mock token'

        models.Users.findOne = jest.fn(() => ({ id: mockUserId, nonce: mockChallenge }))
        models.Sessions.create = jest.fn(() => ({ authToken: mockAuthToken }))

        const req: Partial<Request> = {
          params: {
            challenge: mockChallenge,
            signature: mockSignature,
          },
        }

        const status = jest.fn(() => res)
        const json = jest.fn()
        const res: Partial<Response> = {
          status,
          json,
        }

        await login(req as Request, res as Response, () => {})

        const usersFind: any = models.Users.findOne
        expect(usersFind.mock.calls.length).toEqual(1)
        expect(usersFind.mock.calls[0][0]).toEqual({
          where: { nonce: mockChallenge },
        })

        const sessionsCreate: any = models.Sessions.create
        expect(sessionsCreate.mock.calls.length).toEqual(1)
        expect(sessionsCreate.mock.calls[0][0]).toEqual({
          userId: mockUserId,
          authToken: mockAuthToken,
        })

        expect(json.mock.calls.length).toEqual(1)
        expect(json.mock.calls[0][0]).toEqual({
          data: { token: mockAuthToken },
        })
      })
    })
  })
})

