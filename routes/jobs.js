const express = require('express')
const router = express.Router()
const { authCheck } = require('../middleware/auth')
const {
  addJob,
  editJob,
  getAllJobs,
  getJob,
  deleteJob,
} = require('../controller/jobs')

router.get('/', getAllJobs)
router.get('/:userId', getJob)
router.post('/', authCheck, addJob)
router.put('/', authCheck, editJob)
router.delete('/:id', authCheck, deleteJob)

module.exports = router
