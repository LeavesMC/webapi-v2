import jwt = require("jsonwebtoken");
import RequestContext from "@vclight/router/dist/types/requestContext";
import env from "./env";
import { BadRequest, Unauthorized } from "./restUtils";

export function authentication(request: RequestContext, audience: string) {
    const token = request.headers["authorization"] || request.headers["Authorization"];
    if (typeof token !== "string") throw new BadRequest("Authorization header is not a string");
    const prefix = "Bearer ";
    const lowerPrefix = "bearer ";
    if (!token.startsWith(prefix) && !token.startsWith(lowerPrefix)) throw new BadRequest("Authorization header does not start with Bearer");
    const rawToken = token.substring(prefix.length);
    verifyToken(rawToken, audience);
}

export function verifyToken(token: string, audience: string) {
    try {
        jwt.verify(token, env.jwt.publicKey, {
            algorithms: [env.jwt.algorithm],
            audience: [audience, "*"],
            subject: env.jwt.subject,
            issuer: env.jwt.issuer,
        });
    } catch (err) {
        throw new Unauthorized("Invalid or expired token");
    }
}