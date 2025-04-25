// src/xml/gerarXml.js
const { create } = require('xmlbuilder2');
const dayjs = require('dayjs');
const { gerarChave } = require('../utils/gerarChave');

function gerarXmlNfe(dados) {
  const { emitente, destinatario, produtos } = dados;
  const now = dayjs();
  const nowFormat = now.format('YYYY-MM-DDTHH:mm:ss-03:00');
  const dataNF = now.format('YYYY-MM-DD');

  const chave = gerarChave({
    cUF: '35',
    data: dataNF,
    cnpj: emitente.cnpj,
    modelo: '55',
    serie: '1',
    numero: '123',
    tipoEmissao: '1',
    codigoNumerico: '12345678'
  });

  const totalProdutos = produtos.reduce((acc, item) => acc + item.valorUnitario * item.quantidade, 0);
  const totalICMS = totalProdutos * 0.18;

  const obj = {
    NFe: {
      '@xmlns': 'http://www.portalfiscal.inf.br/nfe',
      infNFe: {
        '@versao': '4.00',
        '@Id': `NFe${chave}`,
        ide: {
          cUF: '35',
          cNF: '12345678',
          natOp: 'Venda de mercadoria',
          mod: '55',
          serie: '1',
          nNF: '123',
          dhEmi: nowFormat,
          tpNF: '1',
          idDest: '1',
          cMunFG: '3550308',
          tpImp: '1',
          tpEmis: '1',
          cDV: chave.slice(-1),
          tpAmb: '2',
          finNFe: '1',
          indFinal: '1',
          indPres: '1',
          procEmi: '0',
          verProc: '1.0.0'
        },
        emit: {
          CNPJ: emitente.cnpj,
          xNome: emitente.nome,
          enderEmit: {
            xLgr: emitente.endereco,
            nro: emitente.numero,
            xBairro: emitente.bairro,
            cMun: emitente.codMunicipio,
            xMun: emitente.municipio,
            UF: emitente.uf,
            CEP: emitente.cep,
            cPais: '1058',
            xPais: 'BRASIL'
          },
          IE: emitente.inscricaoEstadual,
          CRT: emitente.regimeTributario
        },
        dest: {
          CPF: destinatario.cpf,
          xNome: destinatario.nome,
          enderDest: {
            xLgr: destinatario.endereco,
            nro: destinatario.numero,
            xBairro: destinatario.bairro,
            cMun: destinatario.codMunicipio,
            xMun: destinatario.municipio,
            UF: destinatario.uf,
            CEP: destinatario.cep,
            cPais: '1058',
            xPais: 'BRASIL'
          },
          indIEDest: '9'
        },
        det: produtos.map((item, i) => ({
          '@nItem': `${i + 1}`,
          prod: {
            cProd: item.codigo,
            xProd: item.descricao,
            NCM: item.ncm,
            CFOP: item.cfop,
            uCom: item.unidade,
            qCom: item.quantidade.toFixed(2),
            vUnCom: item.valorUnitario.toFixed(2),
            vProd: (item.valorUnitario * item.quantidade).toFixed(2),
            uTrib: item.unidade,
            qTrib: item.quantidade.toFixed(2),
            vUnTrib: item.valorUnitario.toFixed(2),
            indTot: '1'
          },
          imposto: {
            ICMS: {
              ICMS00: {
                orig: '0',
                CST: '00',
                modBC: '3',
                vBC: (item.valorUnitario * item.quantidade).toFixed(2),
                pICMS: '18.00',
                vICMS: ((item.valorUnitario * item.quantidade) * 0.18).toFixed(2)
              }
            },
            PIS: {
              PISAliq: {
                CST: '01',
                vBC: (item.valorUnitario * item.quantidade).toFixed(2),
                pPIS: '1.65',
                vPIS: ((item.valorUnitario * item.quantidade) * 0.0165).toFixed(2)
              }
            },
            COFINS: {
              COFINSAliq: {
                CST: '01',
                vBC: (item.valorUnitario * item.quantidade).toFixed(2),
                pCOFINS: '7.60',
                vCOFINS: ((item.valorUnitario * item.quantidade) * 0.076).toFixed(2)
              }
            }
          }
        })),
        total: {
          ICMSTot: {
            vBC: totalProdutos.toFixed(2),
            vICMS: totalICMS.toFixed(2),
            vProd: totalProdutos.toFixed(2),
            vPIS: (totalProdutos * 0.0165).toFixed(2),
            vCOFINS: (totalProdutos * 0.076).toFixed(2),
            vNF: totalProdutos.toFixed(2)
          }
        },
        transp: {
          modFrete: '9'
        },
        pag: {
          detPag: {
            indPag: '0',
            tPag: '01',
            vPag: totalProdutos.toFixed(2)
          }
        }
      }
    }
  };

  return create(obj).end({ prettyPrint: true });
}

module.exports = { gerarXmlNfe };
