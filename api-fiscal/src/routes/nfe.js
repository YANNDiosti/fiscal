// src/routes/nfe.js
const express = require('express');
const router = express.Router();
const emitirNfeController = require('../nfe/emitir');
const { cancelarNfe } = require('../sefaz/cancelarNfe');
const { inutilizarNfe } = require('../sefaz/inutilizarNfe');
const { consultarNfe } = require('../sefaz/consultarNfe');

// POST /api/nfe/emitir
router.post('/emitir', async (req, res) => {
  try {
    const resultado = await emitirNfeController(req.body);
    res.status(200).json({ sucesso: true, ...resultado });
  } catch (error) {
    console.error('Erro ao emitir NF-e:', error);
    res.status(500).json({ sucesso: false, erro: error.message });
  }
});

// POST /api/nfe/cancelar
router.post('/cancelar', async (req, res) => {
  const { chNFe, protocolo, justificativa } = req.body;
  try {
    const resultado = await cancelarNfe({ chNFe, protocolo, justificativa });
    res.status(200).json({ sucesso: true, resposta: resultado });
  } catch (error) {
    console.error('Erro ao cancelar NF-e:', error);
    res.status(500).json({ sucesso: false, erro: error.message });
  }
});

// POST /api/nfe/inutilizar
router.post('/inutilizar', async (req, res) => {
  try {
    const resultado = await inutilizarNfe(req.body);
    res.status(200).json({ sucesso: true, resposta: resultado });
  } catch (error) {
    console.error('Erro ao inutilizar faixa de NF-e:', error);
    res.status(500).json({ sucesso: false, erro: error.message });
  }
});

// POST /api/nfe/consultar
router.post('/consultar', async (req, res) => {
  const { chNFe } = req.body;
  try {
    const resultado = await consultarNfe(chNFe);
    res.status(200).json({ sucesso: true, resposta: resultado });
  } catch (error) {
    console.error('Erro ao consultar NF-e:', error);
    res.status(500).json({ sucesso: false, erro: error.message });
  }
});

module.exports = router;
