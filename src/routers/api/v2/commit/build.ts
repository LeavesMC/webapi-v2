import router from "../../../router";
import mongodb from "../../../../utils/mango";
import Utils from "../../../../utils/utils";
import PROJECTS from "../../../../utils/projects";

router.on("/v2/commit/build", async function (request, response) {
    if (!await Utils.authentication(request, response)) {
        return;
    }
    const client = mongodb.client;
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
        response.status = 400;
        await client.close();
        return;
    }
    const buildId = await Utils.getLatestBuildId(client, projectId, version) + 1;
    const dbRes = await client
        .db(projectId)
        .collection(Utils.getVersionGroup(version))
        .insertOne({
            build_id: buildId,
            time: new Date().toISOString(),
            channel: channel,
            changes: changes,
            jar_name: jarName,
            sha256: sha256,
            version: version,
            tag: tag.replace(`${version}-`,"")
        });
    response.status = 200;
    response.response = dbRes;
});