import router from "../../../../router";
import mongo from "../../../../../utils/mongo";
import PROJECTS from "../../../../../utils/projects";
import restError from "../../../../../utils/restError";
import Utils from "../../../../../utils/utils";

router.pattern(/^\/v2\/projects\/[^\/]+\/versions\/[^\/]+\/latestGroupBuildId\/?$/, async function(request, response) {
    response.contentType = "application/json";
    try {
        const projectId = request.url.split("/")[3];
        if (!PROJECTS.has(projectId)) {
            return restError.$404(response);

        }
        const version = request.url.split("/")[5];
        const client = mongo.client;
        await client.connect();
        try {
            const latestInfo = (await client
                .db(projectId)
                .collection(Utils.getVersionGroup(projectId, version))
                .find()
                .sort({ build_id: -1 })
                .limit(1)
                .toArray())[0];
            response.status = 200;
            response.contentType = "text/plain";
            response.response = latestInfo.build_id;
        } catch (e) {
            response.contentType = "text/plain";
            response.response = "0";
        }
    } catch (e) {
        console.error(e);
        return restError.$500(response);
    }
});
