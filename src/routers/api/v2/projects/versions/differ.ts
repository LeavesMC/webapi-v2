import router from "../../../../router";
import mongo from "../../../../../utils/mongo";
import PROJECTS from "../../../../../utils/projects";
import restError from "../../../../../utils/restError";
import Utils from "../../../../../utils/utils";

router.pattern(/^\/v2\/projects\/[^\/]+\/versions\/[^\/]+\/differ\/[^\/]+\/?$/, async function(request, response) {
    response.contentType = "text/plain";
    try {
        const projectId = request.url.split("/")[3];
        if (!PROJECTS.has(projectId)) {
            return restError.$404(response);
        }
        const version = request.url.split("/")[5];
        const hash = request.url.split("/")[7];
        const client = mongo.client;
        await client.connect();
        const allData = (await client
            .db(projectId)
            .collection(Utils.getVersionGroup(projectId, version))
            .find({
                version: {
                    $eq: version
                }
            }).toArray());
        let targetBuildId = -1;
        let latestBuildId = -1;

        allData.forEach(data => {
            if (data.build_id > latestBuildId) {
                latestBuildId = data.build_id;
            }

            data.changes.forEach((change: { commit: { startsWith: (arg0: number) => any; }; }) => {
                if (change.commit.startsWith(hash)) {
                    targetBuildId = data.build_id;
                }
            });
        });

        if (targetBuildId === -1) {
            return restError.$404(response);
        }
        response.status = 200;
        response.contentType = "text/plain";
        response.response = `${latestBuildId - targetBuildId}`;
    } catch (e) {
        console.error(e);
        return restError.$500(response);
    }
});
