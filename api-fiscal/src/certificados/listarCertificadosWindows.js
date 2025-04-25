// src/certificados/listarCertificadosWindows.js
const { execSync } = require('child_process');

function listarCertificadosWindows() {
  try {
    const stdout = execSync('certutil -store "MY"');
    const output = stdout.toString('utf8');
    const certificados = [];

    const blocos = output.split('=========================');
    for (const bloco of blocos) {
      const linha = bloco.trim();
      if (linha.includes('Subject:')) {
        const match = linha.match(/CN=([^\r\n]+)/);
        const cn = match ? match[1].trim() : 'Desconhecido';
        const thumbprint = (bloco.match(/Cert Hash\(sha1\):\s*([A-F0-9]+)/i) || [])[1];

        if (thumbprint) {
          certificados.push({ cn, thumbprint });
        }
      }
    }

    return certificados;
  } catch (err) {
    throw new Error('Erro ao listar certificados do Windows: ' + err.message);
  }
}

module.exports = { listarCertificadosWindows };
