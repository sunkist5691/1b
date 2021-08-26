const AWS = require('aws-sdk')
require('dotenv').config()

// connection to DynamoDB as a client
module.exports = new AWS.DynamoDB.DocumentClient({
  region: process.env.AWS_REGION_AREA,
  accessKeyId: process.env.AWS_KEY_ID,
  secretAccessKey: process.env.AWS_KEY_SECRET,
})
