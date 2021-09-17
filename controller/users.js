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

  try {
    await dynamoClient
      .put({
        TableName: TABLE_NAME,
        Item: { id, name, email, role },
      })
      .promise()
    console.log('SUCCESS: adding new user')
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
}
