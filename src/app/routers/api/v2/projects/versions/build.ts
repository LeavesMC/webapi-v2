import router from "../../../../../router";
import { parseAndValidatePathSecs } from "../../../../../utils/requestParser";
import { getProjectName } from "../../../../../utils/projectUtils";
import { getBuildData, parseBuildId, toBuild } from "../../../../../utils/buildUtils";
import { getVersionId } from "../../../../../utils/versionUtils";
import restUtils from "../../../../../utils/restUtils";

router.pattern(/^\/v2\/projects\/[^\/]+\/versions\/[^\/]+\/builds\/[^\/]+\/?$/, async (request, response) => {
    const secs = parseAndValidatePathSecs(request, 7);
    const projectId = secs[2];
    const versionName = secs[4];

    const projectName = await getProjectName(projectId);
    const versionId = await getVersionId(projectId, versionName);
    const buildId = await parseBuildId(projectId, versionId, secs[6]);
    const buildData = await getBuildData(projectId, versionId, buildId);
    const build = await toBuild(buildData);

    return restUtils.$200(response, {
        project_id: projectId,
        project_name: projectName,
        version: versionName,
        ...build,
    });
});