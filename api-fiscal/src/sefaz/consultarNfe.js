// src/sefaz/consultarNfe.js
const axios = require('axios');
const { create } = require('xmlbuilder2');
const { assinarXml } = require('../xml/assinarXml');
const path = require('path');

async function consultarNfe(chNFe) {
  const xmlConsulta = create({
    'consSitNFe': {
      '@xmlns': 'http://www.portalfiscal.inf.br/nfe',
      '@versao': '4.00',
      'tpAmb': '2',
      'xServ': 'CONSULTAR',
      'chNFe': chNFe
    }
  }).end({ prettyPrint: true });

  const caminhoCert = path.resolve(__dirname, '../../certificados/certificado.pfx');
  const senhaCert = process.env.SENHA_CERTIFICADO;
  const xmlAssinado = assinarXml(xmlConsulta, caminhoCert, senhaCert);

  const envelope = `<?xml version="1.0" encoding="UTF-8"?>
  <soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:nfe="http://www.portalfiscal.inf.br/nfe/wsdl/NFeConsultaProtocolo4">
    <soap:Header/>
    <soap:Body>
      <nfe:nfeDadosMsg>
        ${xmlAssinado}
      </nfe:nfeDadosMsg>
    </soap:Body>
  </soap:Envelope>`;

  const url = 'https://homologacao.nfe.fazenda.sp.gov.br/ws/nfeconsultaprotocolo4.asmx';

  try {
    const { data } = await axios.post(url, envelope, {
      headers: {
        'Content-Type': 'application/soap+xml; charset=utf-8'
      },
      timeout: 30000
    });

    return data;
  } catch (err) {
    throw new Error('Erro ao consultar NF-e: ' + err.message);
  }
}

module.exports = { consultarNfe };
