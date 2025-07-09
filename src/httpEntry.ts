import * as http from "http";
import app from "./app/app";
import env from "./app/utils/env";

const server = http.createServer();

server.on("request", app.httpHandler());

server.listen(env.port, "0.0.0.0", () => {
    console.log("LeavesMC WebAPI serve (Powered by VCLight)");
    console.log(`> Ready! Available at http://0.0.0.0:${env.port}`);
});
