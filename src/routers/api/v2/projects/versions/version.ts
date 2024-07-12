import router from "../../../../router";
import mongo from "../../../../../utils/mongo";
import PROJECTS from "../../../../../utils/projects";
import restError from "../../../../../utils/restError";
import Utils from "../../../../../utils/utils";

router.pattern(/^\/v2\/projects\/[^\/]+\/versions\/[^\/]+\/?$/, async function (request, response) {
    response.contentType = "application/json";
    try {
        const projectId = request.url.split("/")[3];
        if (!PROJECTS.has(projectId)) {
            return restError.$404(response);

        }
        const projectData = PROJECTS.get(projectId);
        const version = request.url.split("/")[5];
        const client = mongo.client;
        await client.connect();
        const builds = [];
        (await client
            .db(projectId)
            .collection(Utils.getVersionGroup(version))
            .find({
                version: {
                    $eq: version
                }
            }).toArray())
            .forEach(entry => {
                builds.push(entry.build_id);
            });
        response.status = 200;
        response.contentType = "application/json";
        response.response = {
            code: 200,
            project_id: projectId,
            project_name: projectData.name,
            version: version,
            builds: builds.sort((a, b) => a - b)
        };
    } catch (e) {
        console.error(e);
        return restError.$500(response);
    }
});
