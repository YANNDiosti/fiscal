// app.js
const express = require('express');
const app = express();
const routes = require('./src/routes');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use('/api', routes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API Fiscal rodando na porta ${PORT}`);
});

