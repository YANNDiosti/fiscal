// src/utils/gerarChave.js
function gerarChave({
    cUF,
    data,
    cnpj,
    modelo,
    serie,
    numero,
    tipoEmissao,
    codigoNumerico
  }) {
    const ano = data.slice(2, 4);
    const mes = data.slice(5, 7);
    const dataFormatada = `${ano}${mes}`;
  
    const base =
      cUF +
      dataFormatada +
      cnpj.padStart(14, '0') +
      modelo.padStart(2, '0') +
      serie.padStart(3, '0') +
      numero.padStart(9, '0') +
      tipoEmissao +
      codigoNumerico.padStart(8, '0');
  
    const dv = calcularDV(base);
    return base + dv;
  }
  
  function calcularDV(chave) {
    let soma = 0;
    let peso = 2;
  
    for (let i = chave.length - 1; i >= 0; i--) {
      soma += parseInt(chave[i]) * peso;
      peso = peso === 9 ? 2 : peso + 1;
    }
  
    const resto = soma % 11;
    const dv = resto === 0 || resto === 1 ? 0 : 11 - resto;
    return dv.toString();
  }
  
  module.exports = { gerarChave };
  