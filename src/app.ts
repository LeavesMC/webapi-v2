import VCLight from "vclight";
import router from "./routers/router";
import "./routers/initRouter";

const app = new VCLight();
app.use(router);
export default app;
