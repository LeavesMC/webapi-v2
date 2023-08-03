import VCLightRouter from "vclight-router";

const router = new VCLightRouter({
    buildInRouters: {
        _404: false
    }
});
export default router;

//api v2 routers
import "./api/v2/projects/versions/builds/downloads/download"
import "./api/v2/commit/build";
import "./api/v2/projects/versionGroup/builds"
import "./api/v2/projects/versionGroup/family"
import "./api/v2/projects/versions/builds/build"
import "./api/v2/projects/versions/builds"
import "./api/v2/projects/versions/version"
import "./api/v2/projects/project"
import "./api/v2/projects";
import "./api/v2/docs"
import "./api/v2/api"
import "./api/404";

//common routers
import "./common/index";
import "./common/favicon";


