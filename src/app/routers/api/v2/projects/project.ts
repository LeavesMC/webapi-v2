import { parseAndValidatePathSecs } from "../../../../utils/requestParser.ts";
import restUtils from "../../../../utils/restUtils.ts";
import { getProjectName, getProjectVersionGroups, getProjectVersions } from "../../../../utils/projectUtils.ts";
import router from "../../../../router.ts";

router.pattern(/^\/v2\/projects\/[^\/]+\/?$/, async (request, response) => {
    const secs = parseAndValidatePathSecs(request, 3);
    const projectId = secs[2];

    const projectName = await getProjectName(projectId);
    const versions = await getProjectVersions(projectId);
    const versionGroups = await getProjectVersionGroups(projectId);

    restUtils.$200(response, {
        project_id: projectId,
        project_name: projectName,
        versions: versions,
        version_groups: versionGroups,
    });
});
