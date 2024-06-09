import VCLight, { VCLightRequest, VCLightResponse } from "vclight";
import router from "./routers/router";
import "./routers/initRouter";

const app = new VCLight();
app.use({
    async process(request: VCLightRequest, response: VCLightResponse, app: VCLight): Promise<void> {
    },
    async post(request: VCLightRequest, response: VCLightResponse, app: VCLight): Promise<void> {
        response.headers["access-control-allow-origin"] = "*";
    }
});
app.use(router);
export default app;
