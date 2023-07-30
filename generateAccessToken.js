const jwt = require('jsonwebtoken');
const readline = require('readline');

function input(callback) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    let multilineInput = '';

    rl.setPrompt('Please type Private Key:\n');

    rl.prompt();

    rl.on('line', (input) => {
        multilineInput += input;
        if (input.trim() === '-----END RSA PRIVATE KEY-----') {
            rl.close();
        } else {
            multilineInput += '\n';
        }
    });

    rl.on('close', () => {
        callback(multilineInput);
    });
}

input((key)=>{
    console.log("\nAccess Token:\n",jwt.sign({}, key.trim(), { algorithm: 'RS256' }));
})