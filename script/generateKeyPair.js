const { generateKeyPairSync } = require("crypto");

const { publicKey, privateKey } = generateKeyPairSync("ec", {
    namedCurve: "prime256v1",
    publicKeyEncoding: {
        type: "spki",
        format: "pem"
    },
    privateKeyEncoding: {
        type: "pkcs8",
        format: "pem"
    }
});

console.log(`Public Key: \n${publicKey}`);
console.log("\n");
console.log(`Private Key: \n${privateKey}`);