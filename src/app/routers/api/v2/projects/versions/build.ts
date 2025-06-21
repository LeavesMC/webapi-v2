import router from "../../../../../router.ts";
import { parseAndValidatePathSecs } from "../../../../../utils/requestParser.ts";
import { getProjectName } from "../../../../../utils/projectUtils.ts";
import { getBuildData, parseBuildId, toBuild } from "../../../../../utils/buildUtils.ts";
import { getVersionId } from "../../../../../utils/versionUtils.ts";
import restUtils from "../../../../../utils/restUtils.ts";

router.pattern(/^\/v2\/projects\/[^\/]+\/versions\/[^\/]+\/builds\/[^\/]+\/?$/, async (request, response) => {
    const secs = parseAndValidatePathSecs(request, 7);
    const projectId = secs[2];
    const versionName = secs[4];
    const buildId = parseBuildId(secs[6]);

    const projectName = await getProjectName(projectId);
    const versionId = await getVersionId(projectId, versionName);
    const buildData = await getBuildData(projectId, versionId, buildId);
    const build = await toBuild(buildData);

    return restUtils.$200(response, {
        project_id: projectId,
        project_name: projectName,
        version: versionName,
        ...build,
    });
});