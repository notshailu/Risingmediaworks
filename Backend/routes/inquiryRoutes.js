const express = require('express');
const router = express.Router();
const {
  getInquiries,
  createInquiry,
  updateInquiryStatus,
  deleteInquiry
} = require('../controllers/inquiryController');

router.route('/')
  .get(getInquiries)
  .post(createInquiry);

router.route('/:id')
  .put(updateInquiryStatus)
  .delete(deleteInquiry);

module.exports = router;
