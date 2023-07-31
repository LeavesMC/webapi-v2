import VCLightRouter from "vclight-router";

const router = new VCLightRouter({
    buildInRouters: {
        _404: false
    }
});
export default router;

//common routers
import "./common/index";
import "./common/favicon";

//api v2 routers
import "./api/404";
import "./api/v2/api"
import "./api/v2/docs"
import "./api/v2/projects";
import "./api/v2/commit/build";
