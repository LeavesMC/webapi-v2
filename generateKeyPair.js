const crypto = require('crypto');

const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
});

console.log('Public Key:\n', publicKey.export({ type: 'pkcs1', format: 'pem' }),"\n");
console.log('Private Key:\n', privateKey.export({ type: 'pkcs1', format: 'pem' }));