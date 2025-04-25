const fs = require('fs');
const forge = require('node-forge');
const { SignedXml } = require('xml-crypto');
const { DOMParser } = require('@xmldom/xmldom');

function assinarXml(xml, caminhoPfx, senhaPfx) {
  const pfxBuffer = fs.readFileSync(caminhoPfx);
  const p12Asn1 = forge.asn1.fromDer(pfxBuffer.toString('binary'), false);
  const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, false, senhaPfx);

  let chavePrivada, certificado;

  p12.safeContents.forEach(safeContent => {
    safeContent.safeBags.forEach(safeBag => {
      if (safeBag.type === forge.pki.oids.pkcs8ShroudedKeyBag) {
        chavePrivada = forge.pki.privateKeyToPem(safeBag.key);
      } else if (safeBag.type === forge.pki.oids.certBag) {
        certificado = forge.pki.certificateToPem(safeBag.cert);
      }
    });
  });

  const sig = new SignedXml();
  sig.signatureAlgorithm = 'http://www.w3.org/2001/04/xmldsig-more#rsa-sha256';
  sig.signingKey = chavePrivada;

  sig.addReference(
    "//*[local-name(.)='infNFe']",
    ['http://www.w3.org/2000/09/xmldsig#enveloped-signature'],
    'http://www.w3.org/2001/04/xmlenc#sha256'
  );

  sig.keyInfoProvider = {
    getKeyInfo: () => '<X509Data></X509Data>'
  };

  const doc = new DOMParser().parseFromString(xml, 'text/xml');
  sig.computeSignature(doc);

  return sig.getSignedXml();
}
module.exports = { assinarXml };