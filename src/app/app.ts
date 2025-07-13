import VCLight, { VCLightRequest, VCLightResponse } from "vclight";
import router from "./router";
import "./initRouter";
import "./utils/env";
import { initDb } from "./utils/db/db";

const app = new VCLight();
app.use({
    async process(_: VCLightRequest, __: VCLightResponse, ___: VCLight): Promise<void> {
    },
    async post(_: VCLightRequest, response: VCLightResponse, ___: VCLight): Promise<void> {
        response.headers["access-control-allow-origin"] = "*";
    }
});

initDb().then(() => {
    app.use(router);
});

export default app;
