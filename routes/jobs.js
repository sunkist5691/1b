const express = require('express')
const router = express.Router()
const { authCheck } = require('../middleware/auth')
const {
  addJob,
  editJob,
  getAllJobs,
  getJob,
  deleteJob,
  addApplicant,
} = require('../controller/jobs')

router.get('/', getAllJobs)
router.get('/:userId', getJob)
router.post('/', authCheck, addJob)
router.post('/:userId', authCheck, addApplicant)
router.put('/', authCheck, editJob)
router.delete('/:userId', authCheck, deleteJob)

module.exports = router
