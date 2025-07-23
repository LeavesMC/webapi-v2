import router from "../../../../../router";
import { parseAndValidatePathSecs } from "../../../../../utils/requestParser";
import { getProjectName } from "../../../../../utils/projectUtils";
import { getVersionBuildsData, getVersionId } from "../../../../../utils/versionUtils";
import restUtils from "../../../../../utils/restUtils";

router.pattern(/^\/v2\/projects\/[^\/]+\/versions\/[^\/]+\/?$/, async (request, response) => {
    const secs = parseAndValidatePathSecs(request, 5);
    const projectId = secs[2];
    const version = secs[4];

    const projectName = await getProjectName(projectId);
    const versionId = await getVersionId(projectId, version);
    const buildData = await getVersionBuildsData(projectId, versionId);
    const buildIds = buildData
        .map(it => it.buildId)
        .sort((a, b) => a - b);

    return restUtils.$200(response, {
        project_id: projectId,
        project_name: projectName,
        version: version,
        builds: buildIds,
    });
});