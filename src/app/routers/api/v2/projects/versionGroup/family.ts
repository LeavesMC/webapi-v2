import router from "../../../../../router.ts";
import { parseAndValidatePathSecs } from "../../../../../utils/requestParser.ts";
import restUtils from "../../../../../utils/restUtils.ts";
import { getProjectName } from "../../../../../utils/projectUtils.ts";
import { getVersionGroupId, getVersionGroupVersions } from "../../../../../utils/versionGroupUtils.ts";

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
