// src/xml/gerarXmlNfse.js
const { create } = require('xmlbuilder2');
const dayjs = require('dayjs');

function gerarXmlNfse(dados) {
  const { prestador, tomador, servico } = dados;
  const data = dayjs().format('YYYY-MM-DDTHH:mm:ss');

  const obj = {
    'EnviarLoteRpsEnvio': {
      '@xmlns': 'http://www.abrasf.org.br/nfse.xsd',
      'LoteRps': {
        '@Id': 'Lote1',
        '@versao': '1.00',
        'NumeroLote': '1',
        'Cnpj': prestador.cnpj,
        'InscricaoMunicipal': prestador.inscricaoMunicipal,
        'QuantidadeRps': '1',
        'ListaRps': {
          'Rps': {
            'InfRps': {
              '@Id': 'RPS1',
              'IdentificacaoRps': {
                'Numero': servico.numero,
                'Serie': servico.serie,
                'Tipo': '1'
              },
              'DataEmissao': data,
              'NaturezaOperacao': '1',
              'RegimeEspecialTributacao': '6',
              'OptanteSimplesNacional': '1',
              'IncentivadorCultural': '2',
              'Status': '1',
              'Servico': {
                'Valores': {
                  'ValorServicos': servico.valor.toFixed(2),
                  'IssRetido': '2',
                  'Aliquota': '0.02'
                },
                'ItemListaServico': servico.itemLista,
                'Discriminacao': servico.descricao,
                'CodigoMunicipio': servico.codigoMunicipio
              },
              'Prestador': {
                'Cnpj': prestador.cnpj,
                'InscricaoMunicipal': prestador.inscricaoMunicipal
              },
              'Tomador': {
                'IdentificacaoTomador': {
                  'CpfCnpj': {
                    'Cpf': tomador.cpf
                  }
                },
                'RazaoSocial': tomador.nome,
                'Endereco': {
                  'Endereco': tomador.endereco,
                  'Numero': tomador.numero,
                  'Bairro': tomador.bairro,
                  'CodigoMunicipio': tomador.codigoMunicipio,
                  'Uf': tomador.uf,
                  'Cep': tomador.cep
                }
              }
            }
          }
        }
      }
    }
  };

  return create(obj).end({ prettyPrint: true });
}

module.exports = { gerarXmlNfse };
