// src/nfe/emitir.js
const path = require('path');
const { gerarXmlNfe } = require('../xml/gerarXml');
const { assinarXml } = require('../xml/assinarXml');
const { enviarParaSefaz } = require('../sefaz/enviarNfe');
const { parseRespostaAutorizacao } = require('../sefaz/parseResposta');

async function emitirNfe(dados) {
  // Gera o XML da NF-e
  const xml = gerarXmlNfe(dados);

  // Caminho do certificado A1 (.pfx) e senha
  const caminhoCert = path.resolve(__dirname, '../../certificados/Atual e Original Software.pfx');
  const senhaCert = process.env.SENHA_CERTIFICADO;

  // Assina o XML com o certificado digital
  const xmlAssinado = assinarXml(xml, caminhoCert, senhaCert);

  // Envia para a SEFAZ (ambiente homologação por padrão)
  const respostaSoap = await enviarParaSefaz(xmlAssinado);

  const resposta = parseRespostaAutorizacao(respostaSoap);

  return { xmlAssinado, resposta };
}

module.exports = emitirNfe;
