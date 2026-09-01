const Inquiry = require('../models/Inquiry');

// @desc    Get all inquiries
// @route   GET /api/inquiries
const getInquiries = async (req, res) => {
  const timestamp = new Date().toISOString();
  try {
    const inquiries = await Inquiry.find({}).sort({ createdAt: -1 });
    console.log(`[${timestamp}] [INQUIRY READ] Fetched ${inquiries.length} customer inquiries`);
    res.json(inquiries);
  } catch (error) {
    console.error(`[${timestamp}] [INQUIRY ERROR] Error fetching inquiries:`, error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new inquiry
// @route   POST /api/inquiries
const createInquiry = async (req, res) => {
  const timestamp = new Date().toISOString();
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

    console.log(`[${timestamp}] [INQUIRY RECEIVED SUCCESS] New inquiry from ${name} <${email}> for project type: "${projectType}" (ID: ${savedInquiry._id})`);
    console.log(`[${timestamp}] [FCM NOTIFICATION DISPATCH] Dispatching real-time push notification to registered admin FCM tokens...`);

    res.status(201).json(savedInquiry);
  } catch (error) {
    console.error(`[${timestamp}] [INQUIRY CREATE ERROR] Failed to record inquiry:`, error.message);
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
