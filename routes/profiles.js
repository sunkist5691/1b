const express = require('express')
const router = express.Router()
const { authCheck } = require('../middleware/auth')
const {
  addProfile,
  editProfile,
  getAllProfiles,
  getProfile,
  deleteProfile,
} = require('../controller/profiles')

router.get('/', getAllProfiles)
router.get('/:candidateId', getProfile)
router.post('/', authCheck, addProfile)
router.put('/', authCheck, editProfile)
router.delete('/:id', authCheck, deleteProfile)

module.exports = router
