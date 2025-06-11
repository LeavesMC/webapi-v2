import router from "../../../../../../router";
import mongo from "../../../../../../../utils/mongo";
import PROJECTS from "../../../../../../../utils/projects";
import restError from "../../../../../../../utils/restError";
import Utils from "../../../../../../../utils/utils";

router.pattern(/^\/v2\/projects\/[^\/]+\/versions\/[^\/]+\/builds\/[^\/]+\/downloads\/[^\/]+\/?$/, async function(request, response) {
    try {
        const projectId = request.url.split("/")[3];
        if (!PROJECTS.has(projectId)) {
            return restError.$404(response);
        }
        const projectData = PROJECTS.get(projectId);
        const version = request.url.split("/")[5];
        const build = request.url.split("/")[7];
        const download = request.url.split("/")[9];
        const client = mongo.client;
        await client.connect();
        const dbResult = build === "latest" ?
            (await client
                .db(projectId)
                .collection(Utils.getVersionGroup(projectId, version))
                .find({
                    version: {
                        $eq: version
                    }
                })
                .sort({build_id: -1})
                .limit(1)
                .toArray())[0]
            : (await client
                .db(projectId)
                .collection(Utils.getVersionGroup(projectId, version))
                .find({
                    version: {
                        $eq: version
                    },
                    build_id: {
                        $eq: parseInt(build)
                    }
                }).toArray())[0];
        let downloadUrl = `https://github.com/${projectData.repo}/releases/download/${version}-${dbResult.tag}/${projectId}-${version}.jar`;
        if (download === "rainyun") {
            downloadUrl = `https://${projectId}.cn-nb1.rains3.com/${version}-${dbResult.tag}/${projectId}-${version}.jar`;
        }
        response.status = 302;
        response.redirect = true;
        response.contentType = "application/java-archive";
        response.redirectUrl = downloadUrl;
    } catch (e) {
        console.error(e);
        return restError.$500(response);
    }
});
