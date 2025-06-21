import jwt = require("jsonwebtoken");
import RequestContext from "@vclight/router/dist/types/requestContext";
import env from "./env.ts";
import { BadRequest, Unauthorized } from "./restUtils.ts";

export function authentication(request: RequestContext, audience: string) {
    const token = request.headers["authentication"];
    if (typeof token !== "string") throw new BadRequest("Authentication header is not a string");
    const prefix = "Bearer ";
    const lowerPrefix = "bearer ";
    if (!token.startsWith(prefix) && !token.startsWith(lowerPrefix)) throw new BadRequest("Authentication header does not start with Bearer");
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