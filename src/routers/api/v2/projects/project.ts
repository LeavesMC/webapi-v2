import router from "../../../router";
import mongodb from "../../../../utils/mango";
import PROJECTS from "../../../../utils/projects";
import Utils from "../../../../utils/utils";

router.pattern(/^(?=\/v2\/projects\/)/, async function (request, response) {
    const projectName = request.url.split("/")[3];
    if (!PROJECTS.has(projectName)) {
        Utils.return404(response);
        return;
    }
    const projectData = PROJECTS.get(projectName);
    const client = mongodb.client;
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
                        version: {$addToSet: `$version`},
                    },
                },
                {
                    $project: {
                        _id: 0,
                        version: 1,
                    },
                },
            ]).toArray())[0].version)
            .forEach(version => {
                versionSet.add(version);
            });
    }
    const versions = Array
        .from(versionSet)
        .sort((a, b) => (a < b) ? 1 : -1);
    response.status = 200;
    response.contentType = "application/json";
    response.response=JSON.stringify({
        project_id: projectData.project_id,
        project_name: projectName,
        version_groups: versionGroups,
        versions: versions
    });
})
