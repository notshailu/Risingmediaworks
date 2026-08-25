const express = require('express');
const router = express.Router();
const upload = require('../config/cloudinary');
const {
  getWorks,
  getWorkById,
  createWork,
  updateWork,
  deleteWork
} = require('../controllers/workController');

router.route('/')
  .get(getWorks)
  .post(upload.single('image'), createWork);

router.route('/:id')
  .get(getWorkById)
  .put(upload.single('image'), updateWork)
  .delete(deleteWork);

module.exports = router;
