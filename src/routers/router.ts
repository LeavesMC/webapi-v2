import VCLightRouter from "vclight-router";

const router = new VCLightRouter({
    buildInRouters: {
        _404: false
    }
});
export default router;

//common routers
import "./common/index";

//api v2 routers
import "./api/v2/404";
import "./api/v2/projects";
import "./api/v2/commitBuild";
