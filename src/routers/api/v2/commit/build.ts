import router from "../../../router";
import mongo from "../../../../utils/mongo";
import Utils from "../../../../utils/utils";
import restError from "../../../../utils/restError";

router.on("/v2/commit/build", async function(request, response) {
    response.contentType = "application/json";
    try {
        if (!await Utils.authentication(request)) {
            return restError.$401(response);
        }
        const client = mongo.client;
        await client.connect();
        const body = request.body;
        const projectId = body["project_id"];
        const version = body["version"];
        const channel = body["channel"];
        const changes = body["changes"];
        const jarName = body["jar_name"];
        const sha256 = body["sha256"];
        const tag = body["tag"];
        if (projectId === undefined ||
            version === undefined ||
            channel === undefined ||
            changes === undefined ||
            jarName === undefined ||
            sha256 === undefined ||
            tag === undefined) {
            await client.close();
            return restError.$400(response);
        }
        const changesArray = [];
        changes.split(">>>").forEach((entry: string)=>{
            if(entry === "") {
                return;
            }
            const split = entry.split("<<<");
            changesArray.unshift({
                commit: split[0],
                summary: split[1],
                message: split[1]+"\n"
            });
        });
        const buildId = await Utils.getLatestBuildId(client, projectId, version) + 1;
        const dbRes = await client
            .db(projectId)
            .collection(Utils.getVersionGroup(version))
            .insertOne({
                build_id: buildId,
                time: new Date().toISOString(),
                channel: channel,
                changes: changesArray,
                jar_name: jarName,
                sha256: sha256,
                version: version,
                tag: tag.replace(`${version}-`, "")
            });
        response.status = 200;
        response.response = {
            code: 200,
            data: dbRes
        };
    } catch (e) {
        console.error(e);
        return restError.$500(response);
    }
});