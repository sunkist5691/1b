const dynamoClient = require('../db/dynamo.js')

const TABLE_NAME = 'jobsapi'

exports.getAllJobs = async (req, res) => {
  const params = {
    TableName: TABLE_NAME,
  }

  try {
    const { Items } = await dynamoClient.scan(params).promise()

    if (!Items) throw new SyntaxError('undefined / none of the job post exist')
    console.log('SUCCESS: get all job')
    return res.status(200).json(Items)
  } catch (err) {
    console.log('FAILED: get all job')
    return res.status(500).json(err)
  }
}

exports.getJob = async (req, res) => {
  const { userId } = req.params
  const params = {
    TableName: TABLE_NAME,
    Key: {
      userId,
    },
  }
  try {
    const { Item } = await dynamoClient.get(params).promise()
    if (!Item) throw new SyntaxError('undefined / employer need to post a job')
    console.log('SUCCESS: get a job')
    return res.status(200).json(Item)
  } catch (err) {
    console.log('FAILED: get a job')
    return res.status(500).json(err)
  }
}

exports.addJob = async (req, res) => {
  const params = {
    TableName: TABLE_NAME,
    Key: { userId: req.body.userId },
  }

  const { Item } = await dynamoClient.get(params).promise()

  if (Item) return res.status(401).json({ message: 'Job already exist' })

  try {
    await dynamoClient
      .put({
        TableName: TABLE_NAME,
        Item: { ...req.body },
      })
      .promise()
    console.log('SUCCESS: adding new job: ')
    return res.status(200).json({ status: true, addedJob: req.body })
  } catch (err) {
    console.log('FAILED: adding new job')
    return res.status(500).json(err)
  }
}

exports.addApplicant = async (req, res) => {
  const { userId } = req.params
  const params = {
    TableName: TABLE_NAME,
    Key: {
      userId,
    },
  }
  console.log('*****ready?', req.body)
  const { Item } = await dynamoClient.get(params).promise()
  console.log('****ADD APPLICANT****', Item, req.body)
  try {
    const added = await dynamoClient
      .put({
        TableName: TABLE_NAME,
        Item: { ...Item, applicants: [...Item.applicants, { ...req.body }] },
      })
      .promise()

    return res.status(200).json(added)
  } catch (err) {
    console.log('FAILED: applied')
    return res.status(500).json(err, { message: 'Failed to applied' })
  }
}

exports.editJob = async (req, res) => {
  try {
    await dynamoClient
      .put({
        TableName: TABLE_NAME,
        Item: { ...req.body },
      })
      .promise()
    console.log('SUCCESS: editing a job')
    return res.status(200).json({ status: true, editedJob: req.body })
  } catch (err) {
    console.log('FAILED: editing a job')
    return res.status(500).json(err)
  }
}

exports.deleteJob = async (req, res) => {
  const { userId } = req.params
  const params = {
    TableName: TABLE_NAME,
    Key: {
      userId,
    },
  }
  try {
    await dynamoClient.delete(params).promise()
    console.log('SUCCESS: delete new job')
    return res
      .status(200)
      .json({ message: 'Successfully deleted', jobDel: { ...req.body } })
  } catch (err) {
    console.log('FAILED: delete new job')
    return res.status(500).json(err)
  }
}
