const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const dynamoClient = require('../db/dynamo.js')

const TABLE_NAME = 'usersapi'

exports.signup = async (req, res) => {
  const { id, name, email, role } = req.body

  const params = {
    TableName: TABLE_NAME,
    Key: { id },
  }

  const { Item } = await dynamoClient.get(params).promise()

  if (Item) return res.status(401).json({ message: 'Email already in used' })

  // const hashed = await bcrypt.hash(
  //   password,
  //   parseInt(process.env.BCRYPT_SALT_ROUNDS),
  // )

  try {
    await dynamoClient
      .put({
        TableName: TABLE_NAME,
        Item: { id, name, email, role },
      })
      .promise()
    console.log('SUCCESS: adding new user')
    // const token = createToken(user)
    return res.status(200).json({ id, name, email, role })
  } catch (err) {
    console.log('FAILED: adding new user')
    return res.status(500).json(err)
  }
}

exports.currentUser = async (req, res) => {
  const { id } = req.body
  const params = {
    TableName: TABLE_NAME,
    Key: { id },
  }

  const { Item } = await dynamoClient.get(params).promise()

  if (!Item) return res.status(401).json({ message: 'Invalid user' })
  console.log('ITEM @@@@@: ', Item)
  res.status(200).json(Item)
}

exports.login = async (req, res) => {
  const { id } = req.params
  const params = {
    TableName: TABLE_NAME,
    Key: { id },
  }

  const { Item } = await dynamoClient.get(params).promise()

  if (!Item) {
    return res.status(401).json({ message: 'Invalid user or password' })
  }

  // const isValidPassword = await bcrypt.compare(password, Item.password)
  // if (!isValidPassword)
  //   return res.status(401).json({ message: 'Invalid user or password' })

  // console.log('LOGIN: ', Item.id)
  // const token = createToken(Item)
  // res.status(200).json({ id, token })
}

// function createToken(info) {
//   return jwt.sign(info, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRES_SEC,
//   })
// }
