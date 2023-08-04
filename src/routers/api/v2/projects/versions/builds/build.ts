import router from "../../../../../router";
import mongo from "../../../../../../utils/mongo";
import PROJECTS from "../../../../../../utils/projects";
import restError from "../../../../../../utils/restError";
import Utils from "../../../../../../utils/utils";

router.pattern(/^\/v2\/projects\/\S+\/versions\/\S+\/builds\/\S+$/, async function (request, response) {
    response.contentType = "application/json";
    try {
        const projectId = request.url.split("/")[3];
        if (!PROJECTS.has(projectId)) {
            return restError.$404(response);

        }
        const projectData = PROJECTS.get(projectId);
        const version = request.url.split("/")[5];
        const build = parseInt(request.url.split("/")[7]);
        const client = mongo.client;
        await client.connect();
        const dbResult = (await client
            .db(projectId)
            .collection(Utils.getVersionGroup(version))
            .find({
                version: {
                    $eq: version
                },
                build_id: {
                    $eq: build
                }
            }).toArray())[0];

        response.status = 200;
        response.contentType = "application/json";
        response.response = {
            code: 200,
            project_id: projectId,
            project_name: projectData.name,
            version: version,
            build: build,
            time: dbResult.time,
            channel: dbResult.channel,
            promoted: false,
            changes: dbResult.changes,
            downloads: {
                application: {
                    name: dbResult.jar_name,
                    sha256: dbResult.sha256
                }
            }
        };
    } catch (e) {
        console.error(e);
        return restError.$500(response);
    }
});
