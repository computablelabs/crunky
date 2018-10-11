// Dependencies
import jwt from 'jsonwebtoken'
import ethUtil from 'ethereumjs-util'

const signMessage = ({ message, privateKey }): string => {
  const buffer = ethUtil.toBuffer(message)
  const hash = ethUtil.hashPersonalMessage(buffer)
  const rsv = ethUtil.ecsign(hash, new Buffer(privateKey, 'hex'))

  const signature = ethUtil.toRpcSig(rsv.v, rsv.r, rsv.s)

  return signature
}

const isSignatureValid = ({ publicAddress, nonce, signature }): boolean => {
  const buffer = ethUtil.toBuffer(nonce)
  const hash = ethUtil.hashPersonalMessage(buffer)

  const sigBuffer = ethUtil.toBuffer(signature)
  const sigParams = ethUtil.fromRpcSig(sigBuffer)

  const publicKey = ethUtil.ecrecover(hash, sigParams.v, sigParams.r, sigParams.s)

  const addressBuffer = ethUtil.publicToAddress(publicKey)
  const address = ethUtil.bufferToHex(addressBuffer)

  return address.toLowerCase() === publicAddress.toLowerCase()
}

const generateJwtToken = (userId: string, secretKey: string = process.env.SECRET_KEY): string => {
  const token = jwt.sign({ id: userId }, secretKey, {
    expiresIn: '30 days',
  })

  return token
}

const verifyJwtToken = async (token: string, secretKey: string = process.env.SECRET_KEY): Promise<any> => {
  const decoded = await jwt.verify(token, secretKey)

  return decoded
}

export {
  signMessage,
  isSignatureValid,
  generateJwtToken,
  verifyJwtToken,
}

