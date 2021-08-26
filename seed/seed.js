const axios = require('axios')
const dynamoClient = require('../db/dynamo.js')
const TABLE_NAME = 'pokeapi'

const addCards = async (card) => {
  const params = {
    TableName: TABLE_NAME,
    Item: card,
  }
  return await dynamoClient.put(params).promise()
}

const seedData = async () => {
  const url = 'https://api.pokemontcg.io/v2/cards'
  try {
    const {
      data: { data: cards },
    } = await axios.get(url)

    const cardsPromises = cards.map((card, i) => addCards({ ...card }))
    await Promise.all(cardsPromises)
  } catch (error) {
    console.log(error)
    console.log('SEED FAILED / seed.js')
  }
}

// seedData()
