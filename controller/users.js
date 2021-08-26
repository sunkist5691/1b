const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const dynamoClient = require('../db/dynamo.js')

const TABLE_NAME = 'usersapi'

exports.signup = async (req, res) => {
  const { email, password } = req.body
  const params = {
    TableName: TABLE_NAME,
  }

  const { Items } = await dynamoClient.scan(params).promise()

  if (Items.find((user) => user.email === email)) {
    console.log('Email already in used')
    return res.status(401).json({ message: 'Email already in used' })
  }
  const hashed = await bcrypt.hash(
    password,
    parseInt(process.env.BCRYPT_SALT_ROUNDS),
  )

  try {
    const user = await dynamoClient
      .put({
        ...params,
        Item: { email, password: hashed },
      })
      .promise()
    const token = createToken(user)
    console.log('SUCCESS: adding new user')
    return res.status(200).json({ email, token })
  } catch (err) {
    console.log('FAILED: adding new user')
    return res.status(500).json(err)
  }
}

exports.login = async (req, res) => {
  const { email, password } = req.body
  const params = {
    TableName: TABLE_NAME,
  }

  const { Items } = await dynamoClient.scan(params).promise()
  const user = Items.filter((user) => user.email === email)[0]

  if (!user) {
    return res.status(401).json({ message: 'Invalid user or password' })
  }

  const isValidPassword = await bcrypt.compare(password, user.password)
  if (!isValidPassword)
    return res.status(401).json({ message: 'Invalid user or password' })

  console.log('LOGIN: ', user.email)
  const token = createToken(user)
  res.status(200).json({ email, token })
}

function createToken(info) {
  return jwt.sign(info, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_SEC,
  })
}
