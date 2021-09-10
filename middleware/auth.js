const Verifier = require('verify-cognito-token')

exports.authCheck = async (req, res, next) => {
  const { token } = req.headers
  const params = {
    region: process.env.AWS_REGION_AREA,
    userPoolId: process.env.AWS_COGNITO_POOL_ID,
    debug: true,
  }

  const verifier = new Verifier(params)

  verifier //
    .verify(token)
    .then((result) => {
      if (result) next()
      else res.status(404).json({ message: 'Invalid Token' })
    })
}

exports.adminCheck = async (req, res, next) => {}
