// src/routes/nfse.js
const express = require('express');
const router = express.Router();
const emitirNfse = require('../nfse/emitir');

// POST /api/nfse/emitir
router.post('/emitir', async (req, res) => {
  try {
    const resultado = await emitirNfse(req.body);
    res.status(200).json({ sucesso: true, ...resultado });
  } catch (error) {
    console.error('Erro ao emitir NFS-e:', error);
    res.status(500).json({ sucesso: false, erro: error.message });
  }
});

module.exports = router;
