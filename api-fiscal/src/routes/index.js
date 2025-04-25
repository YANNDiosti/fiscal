// src/routes/index.js
const express = require('express');
const router = express.Router();

const nfeRoutes = require('./nfe');
const nfseRoutes = require('./nfse.js');

router.use('/nfe', nfeRoutes);
router.use('/nfse', nfseRoutes);

module.exports = router;