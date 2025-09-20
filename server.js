const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

// Routes
const inventoryRoutes = require('./routes/inventoryRoutes');
const authRoutes = require('./routes/auth');
const sizeRoutes = require('./routes/sizes');
const userRoutes = require('./routes/userRoutes');
const supplierRoutes = require('./routes/suppliers');

app.use('/api/inventory', inventoryRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/sizes', sizeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/suppliers', supplierRoutes);

app.get('/', (req, res) => {
  res.json({ status: 'ok', name: 'masphamspareparts-backend' });
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
