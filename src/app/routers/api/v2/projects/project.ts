import { parseAndValidatePathSecs } from "../../../../utils/requestParser";
import restUtils from "../../../../utils/restUtils";
import { getProjectName, getProjectVersionGroups, getProjectVersions } from "../../../../utils/projectUtils";
import router from "../../../../router";

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
