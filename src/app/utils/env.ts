import { config } from "dotenv";
import { Algorithm } from "jsonwebtoken";

config();

const env = {
    db: {
        url: process.env.DB_URL!!,
    },
    logLevel: process.env.LOG_LEVEL || "info",
    jwt: {
        publicKey: process.env.API_PUBLIC_KEY!!,
        privateKey: process.env.API_PRIVATE_KEY!!,
        issuer: process.env.API_ISSUER || "LeavesMC",
        subject: process.env.API_SUBJECT || "leaves-ci",
        algorithm: process.env.API_ALGO as Algorithm || "ES256",
    },
};

export default env;
