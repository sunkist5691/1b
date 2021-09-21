const dynamoClient = require('../db/dynamo.js')

const TABLE_NAME = 'profilesapi'

exports.getAllProfiles = async (req, res) => {
  const params = {
    TableName: TABLE_NAME,
  }

  try {
    const { Items } = await dynamoClient.scan(params).promise()
    if (!Item) throw new SyntaxError('undefined / none of the profiles exist')
    console.log('SUCCESS: get all profiles')
    return res.status(200).json(Items)
  } catch (err) {
    console.log('FAILED: get all profiles')
    return res.status(500).json(err)
  }
}

exports.getProfile = async (req, res) => {
  const { candidateId } = req.params
  const params = {
    TableName: TABLE_NAME,
    Key: {
      candidateId,
    },
  }
  try {
    const { Item } = await dynamoClient.get(params).promise()
    if (!Item)
      throw new SyntaxError('undefined / candidate need to post profile')
    console.log('SUCCESS: get a profile')
    return res.status(200).json(Item)
  } catch (err) {
    console.log('FAILED: get a profile')
    return res.status(500).json(err)
  }
}

exports.addProfile = async (req, res) => {
  const params = {
    TableName: TABLE_NAME,
    Key: { candidateId: req.body.candidateId },
  }

  const { Item } = await dynamoClient.get(params).promise()

  if (Item) return res.status(401).json({ message: 'Profile already exist' })

  try {
    await dynamoClient
      .put({
        TableName: TABLE_NAME,
        Item: { ...req.body },
      })
      .promise()
    console.log('SUCCESS: adding new profile: ')
    return res.status(200).json({ status: true, addedProfile: req.body })
  } catch (err) {
    console.log('FAILED: adding new profile')
    return res.status(500).json(err)
  }
}

exports.addApplied = async (req, res) => {
  const { candidateId } = req.params
  const params = {
    TableName: TABLE_NAME,
    Key: {
      candidateId,
    },
  }

  const { Item } = await dynamoClient.get(params).promise()

  try {
    const added = await dynamoClient
      .put({
        TableName: TABLE_NAME,
        Item: { ...Item, applied: [...Item.applied, { ...req.body }] },
      })
      .promise()

    return res.status(200).json(added)
  } catch (err) {
    console.log('FAILED: applied')
    return res.status(500).json(err, { message: 'Failed to applied' })
  }
}

exports.editProfile = async (req, res) => {
  try {
    await dynamoClient
      .put({
        TableName: TABLE_NAME,
        Item: { ...req.body },
      })
      .promise()
    console.log('SUCCESS: editing a profile')
    return res.status(200).json({ status: true, editedProfile: req.body })
  } catch (err) {
    console.log('FAILED: editing a profile')
    return res.status(500).json(err)
  }
}

exports.deleteProfile = async (req, res) => {
  const { id } = req.params
  const params = {
    TableName: TABLE_NAME,
    Key: {
      candidateId: id,
    },
  }
  try {
    await dynamoClient.delete(params).promise()
    console.log('SUCCESS: delete new profile')
    return res
      .status(200)
      .json({ message: 'Successfully deleted', profileDel: { ...req.body } })
  } catch (err) {
    console.log('FAILED: delete new profile')
    return res.status(500).json(err)
  }
}
