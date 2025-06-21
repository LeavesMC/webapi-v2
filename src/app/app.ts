import VCLight from "vclight";
import router from "./router";
import "./initRouter";
import "./utils/env";
import { initDb } from "./utils/db/db.ts";

const app = new VCLight();

initDb().then(() => {
    app.use(router);
});

export default app;
