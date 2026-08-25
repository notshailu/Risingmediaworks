const Work = require('../models/Work');

// @desc    Get all works
// @route   GET /api/works
const getWorks = async (req, res) => {
  try {
    const works = await Work.find({});
    res.json(works);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single work
// @route   GET /api/works/:id
const getWorkById = async (req, res) => {
  try {
    const work = await Work.findById(req.params.id);
    if (work) {
      res.json(work);
    } else {
      res.status(404).json({ message: 'Work not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a work
// @route   POST /api/works
const createWork = async (req, res) => {
  const { title, category, client, description, videoUrl } = req.body;
  let image = req.body.image;

  if (req.file) {
    image = req.file.path; // Cloudinary secure URL if uploaded
  }

  try {
    const work = new Work({
      title,
      category,
      client,
      description,
      videoUrl,
      image
    });

    const createdWork = await work.save();
    res.status(201).json(createdWork);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a work
// @route   PUT /api/works/:id
const updateWork = async (req, res) => {
  const { title, category, client, description, videoUrl } = req.body;
  let image = req.body.image;

  if (req.file) {
    image = req.file.path; // New uploaded image URL
  }

  try {
    const work = await Work.findById(req.params.id);

    if (work) {
      work.title = title || work.title;
      work.category = category || work.category;
      work.client = client || work.client;
      work.description = description || work.description;
      work.videoUrl = videoUrl || work.videoUrl;
      if (image) work.image = image;

      const updatedWork = await work.save();
      res.json(updatedWork);
    } else {
      res.status(404).json({ message: 'Work not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a work
// @route   DELETE /api/works/:id
const deleteWork = async (req, res) => {
  try {
    const work = await Work.findById(req.params.id);

    if (work) {
      await work.deleteOne();
      res.json({ message: 'Work removed' });
    } else {
      res.status(404).json({ message: 'Work not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getWorks,
  getWorkById,
  createWork,
  updateWork,
  deleteWork
};
