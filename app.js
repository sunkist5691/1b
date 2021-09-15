const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const sayhelloRouter = require('./sayhello')
const usersRoutes = require('./routes/users')
const jobsRoutes = require('./routes/jobs')
const app = express()

app.use(morgan('tiny'))
app.use(express.json())
app.use(cors())

app.use('/users', usersRoutes)
app.use('/jobs', jobsRoutes)
app.use('/sayhello', sayhelloRouter)

app.listen(process.env.PORT, async () => {
  console.log(`Server is running on port ${process.env.PORT}`)
  console.log(
    '<--------------------Database is Connected!--------------------->',
  )
})

module.exports = app
