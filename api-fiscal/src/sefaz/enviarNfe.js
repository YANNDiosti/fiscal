// src/sefaz/enviarNfe.js
const axios = require('axios');
const { parseStringPromise } = require('xml2js');

async function enviarParaSefaz(xmlAssinado, ambiente = '2') {
  const url = ambiente === '1'
    ? 'https://nfe.fazenda.sp.gov.br/ws/nfeautorizacao4.asmx'
    : 'https://homologacao.nfe.fazenda.sp.gov.br/ws/nfeautorizacao4.asmx';

  const soapEnvelope = `<?xml version="1.0" encoding="UTF-8"?>
  <soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:nfe="http://www.portalfiscal.inf.br/nfe/wsdl/NFeAutorizacao4">
    <soap:Header/>
    <soap:Body>
      <nfe:nfeDadosMsg>
        ${xmlAssinado}
      </nfe:nfeDadosMsg>
    </soap:Body>
  </soap:Envelope>`;

  try {
    const { data } = await axios.post(url, soapEnvelope, {
      headers: {
        'Content-Type': 'application/soap+xml; charset=utf-8'
      },
      timeout: 30000
    });

    const resposta = await parseStringPromise(data);
    return resposta;
  } catch (erro) {
    throw new Error('Erro ao enviar XML para a SEFAZ: ' + erro.message);
  }
}

module.exports = { enviarParaSefaz };
