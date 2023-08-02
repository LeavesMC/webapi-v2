import router from "../../../router";
import mongo from "../../../../utils/mongo";
import PROJECTS from "../../../../utils/projects";
import restError from "../../../../utils/restError";

router.pattern(/^(?=\/v2\/projects\/)/, async function(request, response) {
    response.contentType = "application/json";
    if (request.method != "POST") {
        return restError.$400(response);
    }
    try {
        const projectName = request.url.split("/")[3];
        if (!PROJECTS.has(projectName)) {
            return restError.$404(response);

        }
        const projectData = PROJECTS.get(projectName);
        const client = mongo.client;
        await client.connect();
        const versionGroups = (await client
            .db(projectName)
            .listCollections()
            .toArray())
            .map(collection => collection.name)
            .sort((a, b) => (a < b) ? 1 : -1);
        const versionSet: Set<string> = new Set();
        for (const versionGroup of versionGroups) {
            ((await client
                .db(projectName)
                .collection(versionGroup)
                .aggregate([
                    {
                        $group: {
                            _id: null,
                            version: { $addToSet: `$version` }
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            version: 1
                        }
                    }
                ]).toArray())[0].version)
                .forEach((version: string) => {
                    versionSet.add(version);
                });
        }
        const versions = Array
            .from(versionSet)
            .sort((a, b) => (a < b) ? 1 : -1);
        response.status = 200;
        response.contentType = "application/json";
        response.response = {
            code: 200,
            data: {
                project_id: projectData.project_id,
                project_name: projectName,
                version_groups: versionGroups,
                versions: versions
            }
        };
    } catch (e) {
        console.error(e);
        return restError.$500(response);
    }
});
