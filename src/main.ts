import VCLight from "vclight";
import router from "./routers/router";
import { VercelRequest, VercelResponse } from "@vercel/node";

module.exports = async function(request: VercelRequest, response: VercelResponse) {
    const app = new VCLight();
    app.use(router);
    response.setHeader("Access-Control-Allow-Origin", "*");
    await app.fetch(request, response);
};
