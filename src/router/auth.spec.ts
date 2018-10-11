// Dependencies
import request from 'supertest'

// Local Dependencies
import app from '../app'
import { signMessage, verifyJwtToken } from '../helpers'
import { clearDatabase } from '../../specs/helpers'

describe('auth routes', () => {
  describe('/signup', () => {
    describe('with invalid params', () => {
      it('requires `publicAddress`', async (done) => {
        request(app)
          .post('/signup')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(400, {
            statusCode: 400,
            error: 'Bad Request',
            message: '"publicAddress" is required',
          }, done)
      })
    })
  })

  describe('login flow', () => {
    beforeAll(async (done) => {
      await clearDatabase()

      this.request = request(app)
      this.address = '0x294b477eED34F3474A95D625C7821304587FFdBE'
      this.privateKey = '33dfd877d307dc8872b9d474bf902651f49030559d7168d72059372505cc8628'

      this.request
        .post('/signup')
        .send({
          publicAddress: this.address,
        })
        .expect(201)
        .then(async (res) => {
          this.userId = res.body.data.id

          done()
        })
    })

    it('retrieves a challenge, signs it, and generates an auth token with a valid signature', async (done) => {
      this.request
        .get(`/auth/${this.address}`)
        .set('Accept', 'application/json')
        .expect(200)
        .then(async (res) => {
          const { challenge } = res.body.data

          const signature = signMessage({
            message: challenge,
            privateKey: this.privateKey,
          })

          this.request
            .post(`/auth/${challenge}/${signature}`)
            .set('Accept', 'application/json')
            // .expect(201)
            .then(async (res) => {
              const { token } = res.body.data
              const decodedToken = await verifyJwtToken(token)

              expect(decodedToken.id).toEqual(this.userId)

              done()
            })
        })
    })
  })
})

