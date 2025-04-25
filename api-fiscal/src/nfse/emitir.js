// src/nfse/emitir.js
const path = require('path');
const { gerarXmlNfse } = require('../xml/gerarXmlNfse');
const { assinarXml } = require('../xml/assinarXml');

async function emitirNfse(dados) {
  const xml = gerarXmlNfse(dados);

  const caminhoCert = path.resolve(__dirname, '../../certificados/Atual e Original Software.pfx');
  const senhaCert = process.env.SENHA_CERTIFICADO;

  const xmlAssinado = assinarXml(xml, caminhoCert, senhaCert);

  // Aqui seria o ponto para envio à prefeitura (Ginfes, Betha etc.)
  // Retornamos apenas o XML assinado por enquanto

  return { xmlAssinado };
}

module.exports = emitirNfse;
