// src/certificados/usarCertificadoWindows.js
const { Crypto } = require('@peculiar/webcrypto');
const { readFileSync } = require('fs');

// Esse é um esqueleto inicial para uso de certificados do Windows
// Integração completa exige suporte a CAPI/PKCS#11 ou WinCSP, com bibliotecas nativas
// Essa abordagem usa webcrypto apenas como base (exemplo conceitual)

function usarCertificadoInstalado(thumbprint) {
  // Aqui deveria ser feita a integração com o repositório da máquina
  // Em Node puro, não há acesso direto a certificados da store
  // Precisa de bibliotecas como: edge-js, smartcard, @node-webcrypto/p11 ou wrappers em C++

  throw new Error('Integração com certificados instalados requer implementação nativa via PKCS#11 ou CSP');
}

module.exports = { usarCertificadoInstalado };