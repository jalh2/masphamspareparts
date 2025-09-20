const Tire = require('../models/Tire');

// Get all tires
exports.getAllTires = async (req, res) => {
  try {
    const tires = await Tire.find();
    res.json(tires);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single tire
exports.getTire = async (req, res) => {
  try {
    const tire = await Tire.findById(req.params.id);
    if (!tire) {
      return res.status(404).json({ message: 'Spare part not found' });
    }
    res.json(tire);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new tire
exports.createTire = async (req, res) => {
  try {
    // Check for existing spare part (by name, and by size if provided)
    const query = { name: req.body.name };
    if (req.body.size) {
      query.size = req.body.size;
    }
    const existingItem = await Tire.findOne(query);

    if (existingItem) {
      return res.status(400).json({
        message: req.body.size
          ? 'A spare part with this name and size already exists'
          : 'A spare part with this name already exists',
        existingItem,
      });
    }

    const tire = new Tire({
      name: req.body.name,
      size: req.body.size,
      price: req.body.price,
      currency: req.body.currency || 'USD',
      currentQuantity: req.body.quantity || 0,
      quantityHistory: [
        {
          quantity: req.body.quantity || 0,
          date: new Date(),
          type: 'initial',
        },
      ],
    });

    const newTire = await tire.save();
    res.status(201).json(newTire);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update tire quantity
exports.updateQuantity = async (req, res) => {
  try {
    const tire = await Tire.findById(req.params.id);
    if (!tire) {
      return res.status(404).json({ message: 'Spare part not found' });
    }

    const { quantity, type } = req.body;

    // Validate type
    if (!['addition', 'subtraction'].includes(type)) {
      return res.status(400).json({ message: 'Invalid operation type. Must be either "addition" or "subtraction"' });
    }

    // Calculate new quantity
    const newQuantity = tire.currentQuantity + quantity;

    // Check if new quantity would be negative
    if (newQuantity < 0) {
      return res.status(400).json({ message: 'Cannot reduce quantity below 0' });
    }

    // Update tire
    tire.currentQuantity = newQuantity;
    tire.quantityHistory.push({
      quantity: quantity,
      type: type,
      date: new Date(),
    });

    const updatedTire = await tire.save();
    res.json(updatedTire);
  } catch (error) {
    console.error('Error updating spare part quantity:', error);
    res.status(400).json({ message: error.message });
  }
};

// Update tire price
exports.updatePrice = async (req, res) => {
  try {
    const tire = await Tire.findById(req.params.id);
    if (!tire) {
      return res.status(404).json({ message: 'Spare part not found' });
    }

    const { price } = req.body;

    if (price === undefined || price === null) {
      return res.status(400).json({ message: 'Price is required' });
    }

    if (typeof price !== 'number' || price < 0) {
      return res.status(400).json({ message: 'Price must be a non-negative number' });
    }

    tire.price = price;

    const updatedTire = await tire.save();
    res.json(updatedTire);
  } catch (error) {
    console.error('Error updating spare part price:', error);
    res.status(400).json({ message: error.message });
  }
};

// Delete a tire
exports.deleteTire = async (req, res) => {
  try {
    const result = await Tire.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Spare part not found' });
    }
    res.json({ message: 'Spare part deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
