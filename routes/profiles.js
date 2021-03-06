const express = require('express')
const router = express.Router()
const { authCheck } = require('../middleware/auth')
const {
  addProfile,
  addApplied,
  editProfile,
  editApplied,
  getAllProfiles,
  getProfile,
  deleteProfile,
} = require('../controller/profiles')

router.get('/', getAllProfiles)
router.get('/:candidateId', getProfile)
router.post('/', authCheck, addProfile)
router.post('/:candidateId', authCheck, addApplied)
router.put('/:candidateId', authCheck, editApplied)
router.put('/', authCheck, editProfile)
router.delete('/:id', authCheck, deleteProfile)

module.exports = router
