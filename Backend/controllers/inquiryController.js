const Inquiry = require('../models/Inquiry');

// @desc    Get all inquiries
// @route   GET /api/inquiries
const getInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({}).sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new inquiry
// @route   POST /api/inquiries
const createInquiry = async (req, res) => {
  const { name, email, phone, company, projectType, details } = req.body;

  try {
    const inquiry = new Inquiry({
      name,
      email,
      phone,
      company,
      projectType: projectType || 'General Project Enquiry',
      details,
      status: 'New'
    });

    const savedInquiry = await inquiry.save();

    console.log(`[NOTIFICATION] New inquiry received from ${name} (${email}) for ${projectType}`);

    res.status(201).json(savedInquiry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update inquiry status (e.g. New <-> Responded)
// @route   PUT /api/inquiries/:id
const updateInquiryStatus = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);

    if (inquiry) {
      inquiry.status = req.body.status || (inquiry.status === 'New' ? 'Responded' : 'New');
      const updatedInquiry = await inquiry.save();
      res.json(updatedInquiry);
    } else {
      res.status(404).json({ message: 'Inquiry not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete inquiry
// @route   DELETE /api/inquiries/:id
const deleteInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);

    if (inquiry) {
      await inquiry.deleteOne();
      res.json({ message: 'Inquiry removed' });
    } else {
      res.status(404).json({ message: 'Inquiry not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getInquiries,
  createInquiry,
  updateInquiryStatus,
  deleteInquiry
};
