const readline = require("readline");
const jwt = require("jsonwebtoken");

const audience = "/v2/commit/build/download_source"; // or other api endpoint, or "*" for all endpoints
const issuer = "LeavesMC"; // when modify here, also modify in the server environment variable API_ISSUER
const subject = "leaves-ci"; // when modify here, also modify in the server environment variable API_SUBJECT
const algorithm = "ES256"; // when modify here, also modify in the server environment variable API_ALGO. supported: https://github.com/auth0/node-jsonwebtoken#algorithms-supported
const expiration = "10y";

function input(callback) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    let multilineInput = "";
    rl.setPrompt("Please type Private Key, then press ENTER:\n");
    rl.prompt();
    rl.on("line", (input) => {
        multilineInput += input;
        if (input.trim() === "-----END PRIVATE KEY-----") {
            rl.close();
        } else {
            multilineInput += "\n";
        }
    });

    rl.on("close", () => {
        callback(multilineInput);
    });
}

input((key) => {
    const privateKey = key.trim();
    try {
        const token = jwt.sign({}, privateKey, {
            algorithm: algorithm,
            expiresIn: expiration,
            issuer: issuer,
            audience: audience,
            subject: subject
        });
        console.log("Token: \n" + token);
    } catch (e) {
        console.error("Failed to generate token: ", e.message);
    }
});