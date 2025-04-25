// src/sefaz/inutilizarNfe.js
const axios = require('axios');
const { create } = require('xmlbuilder2');
const { assinarXml } = require('../xml/assinarXml');
const path = require('path');

async function inutilizarNfe({ ano, cnpj, serie, numeroInicial, numeroFinal, justificativa }) {
  const dataHora = new Date().toISOString();

  const xmlInutilizacao = create({
    'inutNFe': {
      '@xmlns': 'http://www.portalfiscal.inf.br/nfe',
      '@versao': '4.00',
      'infInut': {
        '@Id': `ID35${cnpj}${ano}${serie.padStart(3, '0')}${numeroInicial.padStart(9, '0')}${numeroFinal.padStart(9, '0')}`,
        'tpAmb': '2',
        'xServ': 'INUTILIZAR',
        'cUF': '35',
        'ano': ano,
        'CNPJ': cnpj,
        'mod': '55',
        'serie': serie,
        'nNFIni': numeroInicial,
        'nNFFin': numeroFinal,
        'xJust': justificativa
      }
    }
  }).end({ prettyPrint: true });

  const caminhoCert = path.resolve(__dirname, '../../certificados/certificado.pfx');
  const senhaCert = process.env.SENHA_CERTIFICADO;
  const xmlAssinado = assinarXml(xmlInutilizacao, caminhoCert, senhaCert);

  const envelope = `<?xml version="1.0" encoding="UTF-8"?>
  <soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:nfe="http://www.portalfiscal.inf.br/nfe/wsdl/NFeInutilizacao4">
    <soap:Header/>
    <soap:Body>
      <nfe:nfeDadosMsg>
        ${xmlAssinado}
      </nfe:nfeDadosMsg>
    </soap:Body>
  </soap:Envelope>`;

  const url = 'https://homologacao.nfe.fazenda.sp.gov.br/ws/nfeinutilizacao4.asmx';

  try {
    const { data } = await axios.post(url, envelope, {
      headers: {
        'Content-Type': 'application/soap+xml; charset=utf-8'
      },
      timeout: 30000
    });

    return data;
  } catch (err) {
    throw new Error('Erro ao inutilizar numeração: ' + err.message);
  }
}

module.exports = { inutilizarNfe };
