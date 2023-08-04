import router from "../../../../../../router";
import mongo from "../../../../../../../utils/mongo";
import PROJECTS from "../../../../../../../utils/projects";
import restError from "../../../../../../../utils/restError";
import Utils from "../../../../../../../utils/utils";

router.pattern(/^\/v2\/projects\/\S+\/versions\/\S+\/builds\/\S+\/downloads\/\S+$/, async function(request, response) {
    try {
        const projectId = request.url.split("/")[3];
        if (!PROJECTS.has(projectId)) {
            return restError.$404(response);
        }
        const projectData = PROJECTS.get(projectId);
        const version = request.url.split("/")[5];
        const build = parseInt(request.url.split("/")[7]);
        const source = request.query["source"];
        if (Array.isArray(source)) {
            return restError.$400(response);
        }
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
        let downloadUrl = `https://github.com/${projectData.repo}/releases/download/${version}-${dbResult.tag}/${projectId}-${version}.jar`;
        if (source != null)
            switch (source.toLowerCase()) {
                case "github":
                    break;
                case "ghproxy":
                    downloadUrl = `https://ghproxy.com/?q=${encodeURIComponent(downloadUrl)}`;
                    break;
                default:
                    return restError.$400(response);
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
