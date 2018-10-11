// Local Dependencies
import {
  signMessage,
  isSignatureValid,
  generateJwtToken,
  verifyJwtToken,
} from './auth'

const secretKey = 'secret key'
const privateKey = 'C3F28AF7A26125B7AC16917C298FD07D8AE8D718A14DFF4B6E4AC206502401D4'
const publicAddress = '0x1345fa9de5e8321aac1ff0e23248a5fbdec3922d'

describe('auth helpers', () => {
  describe('#signMessage + #isSignatureValid', () => {
    it('signs the provided message with the private key', () => {
      const message = 'mock message'
      const signature = signMessage({ message, privateKey })

      const isValid = isSignatureValid({
        publicAddress: publicAddress,
        nonce: message,
        signature,
      })

      expect(isValid).toEqual(true)
    })
  })

  describe('#generateJwtToken + #verifyJwtToken', () => {
    it('returns a valid token', async () => {
      const id = 'mock user id'
      const token = generateJwtToken(id, secretKey)
      const decoded = await verifyJwtToken(token, secretKey)

      expect(decoded.id).toEqual(id)
    })
  })
})

