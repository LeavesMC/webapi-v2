import router from "../../../../router";
import mongo from "../../../../../utils/mongo";
import PROJECTS from "../../../../../utils/projects";
import restError from "../../../../../utils/restError";
import Utils from "../../../../../utils/utils";

router.pattern(/^\/v2\/projects\/[^\/]+\/version_group\/?$/, async function (request, response) {
    response.contentType = "application/json";
    try {
        const projectId = request.url.split("/")[3];
        if (!PROJECTS.has(projectId)) {
            return restError.$404(response);

        }
        const projectData = PROJECTS.get(projectId);
        const versionGroup = request.url.split("/")[5];
        const client = mongo.client;
        await client.connect();
        response.status = 200;
        response.contentType = "application/json";
        response.response = {
            code: 200,
            project_id: projectId,
            project_name: projectData.name,
            version_group: versionGroup,
            versions: Array
                .from(await Utils.getVersions(client,projectId,versionGroup))
                .sort()
        };
    } catch (e) {
        console.error(e);
        return restError.$500(response);
    }
});
