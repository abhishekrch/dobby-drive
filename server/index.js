require('dotenv').config();
const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const folderRoutes = require('./routes/folderRoutes');
const imageRoutes = require('./routes/imageRoutes');
const db = require('./config/db');
const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: 'https://dobby-drive-c.vercel.app', 
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', 
  credentials: true, 
  optionsSuccessStatus: 204, 
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions)); 
app.use(express.json());

db.connect();

app.use('/api/users', userRoutes);
app.use('/api/folders', folderRoutes);
app.use('/api/images', imageRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});