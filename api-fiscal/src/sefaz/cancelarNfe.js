// src/sefaz/cancelarNfe.js
const axios = require('axios');
const { create } = require('xmlbuilder2');
const { assinarXml } = require('../xml/assinarXml');
const fs = require('fs');
const path = require('path');

async function cancelarNfe({ chNFe, protocolo, justificativa }) {
  const dataHora = new Date().toISOString();

  const xmlCancelamento = create({
    'envEvento': {
      '@xmlns': 'http://www.portalfiscal.inf.br/nfe',
      '@versao': '1.00',
      'idLote': '1',
      'evento': {
        '@versao': '1.00',
        'infEvento': {
          '@Id': `ID110111${chNFe}01`,
          'cOrgao': '35',
          'tpAmb': '2',
          'CNPJ': '12345678000195', // ajustar para o emitente
          'chNFe': chNFe,
          'dhEvento': dataHora,
          'tpEvento': '110111',
          'nSeqEvento': '1',
          'verEvento': '1.00',
          'detEvento': {
            '@versao': '1.00',
            'descEvento': 'Cancelamento',
            'nProt': protocolo,
            'xJust': justificativa
          }
        }
      }
    }
  }).end({ prettyPrint: true });

  const caminhoCert = path.resolve(__dirname, '../../certificados/certificado.pfx');
  const senhaCert = process.env.SENHA_CERTIFICADO;
  const xmlAssinado = assinarXml(xmlCancelamento, caminhoCert, senhaCert);

  const envelope = `<?xml version="1.0" encoding="UTF-8"?>
  <soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:nfe="http://www.portalfiscal.inf.br/nfe/wsdl/RecepcaoEvento">
    <soap:Header/>
    <soap:Body>
      <nfe:nfeDadosMsg>
        ${xmlAssinado}
      </nfe:nfeDadosMsg>
    </soap:Body>
  </soap:Envelope>`;

  const url = 'https://homologacao.nfe.fazenda.sp.gov.br/ws/recepcaoevento.asmx';

  try {
    const { data } = await axios.post(url, envelope, {
      headers: {
        'Content-Type': 'application/soap+xml; charset=utf-8'
      },
      timeout: 30000
    });

    return data;
  } catch (err) {
    throw new Error('Erro ao cancelar NF-e: ' + err.message);
  }
}

module.exports = { cancelarNfe };