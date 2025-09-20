const Size = require('../models/Size');

// Get all sizes
exports.getAllSizes = async (req, res) => {
  try {
    const sizes = await Size.find().sort({ value: 1 });
    res.json(sizes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sizes', error: error.message });
  }
};

// Add a new size
exports.addSize = async (req, res) => {
  try {
    const { size } = req.body;

    // Check if size already exists
    const existingSize = await Size.findOne({ value: size });
    if (existingSize) {
      return res.status(400).json({ message: 'This size already exists' });
    }

    const newSize = new Size({ value: size });
    await newSize.save();

    res.status(201).json(newSize);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error adding size', error: error.message });
  }
};

// Delete a size
exports.deleteSize = async (req, res) => {
  try {
    const size = await Size.findById(req.params.id);

    if (!size) {
      return res.status(404).json({ message: 'Size not found' });
    }

    await size.remove();
    res.json({ message: 'Size deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting size', error: error.message });
  }
};
