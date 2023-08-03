import router from "../../../router";
import mongo from "../../../../utils/mongo";
import PROJECTS from "../../../../utils/projects";
import restError from "../../../../utils/restError";

router.pattern(/^\/v2\/projects\/\S+$/, async function(request, response) {
    response.contentType = "application/json";
    try {
        const projectId = request.url.split("/")[3];
        if (!PROJECTS.has(projectId)) {
            return restError.$404(response);

        }
        const projectData = PROJECTS.get(projectId);
        const client = mongo.client;
        await client.connect();
        const versionGroups = (await client
            .db(projectId)
            .listCollections()
            .toArray())
            .map(collection => collection.name)
            .sort();
        const versionSet: Set<string> = new Set();
        for (const versionGroup of versionGroups) {
            ((await client
                .db(projectId)
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
            .sort();
        response.status = 200;
        response.contentType = "application/json";
        response.response = {
            code: 200,
            project_id: projectId,
            project_name: projectData.name,
            version_groups: versionGroups,
            versions: versions
        };
    } catch (e) {
        console.error(e);
        return restError.$500(response);
    }
});
