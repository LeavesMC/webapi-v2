import { VercelRequest, VercelResponse } from "@vercel/node";
import app from "./app";

export default async function(request: VercelRequest, response: VercelResponse) {
    response.setHeader("Access-Control-Allow-Origin", "*");
    await app.vercelHandler()(request, response);
};
