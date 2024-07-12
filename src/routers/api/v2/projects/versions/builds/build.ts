import router from "../../../../../router";
import mongo from "../../../../../../utils/mongo";
import PROJECTS from "../../../../../../utils/projects";
import restError from "../../../../../../utils/restError";
import Utils from "../../../../../../utils/utils";

router.pattern(/^\/v2\/projects\/[^\/]+\/versions\/[^\/]+\/builds\/[^\/]+\/?$/, async function (request, response) {
    response.contentType = "application/json";
    try {
        const projectId = request.url.split("/")[3];
        if (!PROJECTS.has(projectId)) {
            return restError.$404(response);

        }
        const projectData = PROJECTS.get(projectId);
        const version = request.url.split("/")[5];
        const build = request.url.split("/")[7];
        const client = mongo.client;
        await client.connect();
        const dbResult = build === "latest" ?
            (await client
                .db(projectId)
                .collection(Utils.getVersionGroup(version))
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
                .collection(Utils.getVersionGroup(version))
                .find({
                    version: {
                        $eq: version
                    },
                    build_id: {
                        $eq: parseInt(build)
                    }
                }).toArray())[0];

        console.log((await client
            .db(projectId)
            .collection(Utils.getVersionGroup(version))
            .find({
                version: {
                    $eq: version
                },
                build_id: {
                    $eq: parseInt(build)
                }
            }).toArray()))
        response.status = 200;
        response.contentType = "application/json";
        response.response = {
            code: 200,
            project_id: projectId,
            project_name: projectData.name,
            version: version,
            build: dbResult.build_id,
            time: dbResult.time,
            channel: dbResult.channel,
            promoted: false, // dbResult.promoted // @TODO
            changes: dbResult.changes,
            downloads: {
                application: {
                    name: dbResult.jar_name,
                    sha256: dbResult.sha256
                }, // Better mirror list
                ghproxy: {
                    name: dbResult.jar_name,
                    sha256: null
                },
                cloud: {
                    name: dbResult.jar_name,
                    sha256: null
                }
            }
        };
    } catch (e) {
        console.error(e);
        return restError.$500(response);
    }
});
