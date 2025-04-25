// src/sefaz/parseResposta.js
function parseRespostaAutorizacao(respostaSoap) {
    try {
      const body = respostaSoap['soap:Envelope']['soap:Body'][0];
      const retorno = body['nfeResultMsg'][0]['retEnviNFe'][0];
  
      const status = retorno.cStat?.[0];
      const motivo = retorno.xMotivo?.[0];
  
      let protocolo = null;
      let recibo = null;
  
      if (retorno.infRec) {
        recibo = retorno.infRec[0].nRec?.[0];
      }
  
      if (retorno.protNFe && retorno.protNFe[0].infProt) {
        protocolo = retorno.protNFe[0].infProt[0].nProt?.[0];
      }
  
      return {
        status,
        motivo,
        protocolo,
        recibo,
        raw: retorno
      };
    } catch (err) {
      throw new Error('Erro ao interpretar resposta da SEFAZ: ' + err.message);
    }
  }
  
  module.exports = { parseRespostaAutorizacao };
  