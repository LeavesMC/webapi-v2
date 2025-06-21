import router from "../../../../../router";
import { parseAndValidatePathSecs } from "../../../../../utils/requestParser";
import restUtils from "../../../../../utils/restUtils";
import { getProjectName } from "../../../../../utils/projectUtils";
import { getVersionGroupId, getVersionGroupVersions } from "../../../../../utils/versionGroupUtils";

router.pattern(/^\/v2\/projects\/[^\/]+\/version_group\/[^\/]+\/?$/, async (request, response) => {
    const secs = parseAndValidatePathSecs(request, 5);
    const projectId = secs[2];
    const versionGroup = secs[4];

    const projectName = await getProjectName(projectId);
    const versionGroupId = await getVersionGroupId(projectId, versionGroup);
    const versions = await getVersionGroupVersions(projectId, versionGroupId);

    restUtils.$200(response, {
        project_id: projectId,
        project_name: projectName,
        version_group: versionGroup,
        versions: versions.names,
    });
});
