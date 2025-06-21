import router from "../../../../../router.ts";
import { parseAndValidatePathSecs } from "../../../../../utils/requestParser.ts";
import { getProjectName } from "../../../../../utils/projectUtils.ts";
import { getVersionBuildsData, getVersionId } from "../../../../../utils/versionUtils.ts";
import restUtils from "../../../../../utils/restUtils.ts";
import { toBuild } from "../../../../../utils/buildUtils.ts";

router.pattern(/^\/v2\/projects\/[^\/]+\/versions\/[^\/]+\/builds\/?$/, async (request, response) => {
    const secs = parseAndValidatePathSecs(request, 5);
    const projectId = secs[2];
    const version = secs[4];

    const projectName = await getProjectName(projectId);
    const versionId = await getVersionId(projectId, version);
    const buildData = await getVersionBuildsData(projectId, versionId);
    const builds = await Promise.all(buildData.map(it => toBuild(it)));

    return restUtils.$200(response, {
        project_id: projectId,
        project_name: projectName,
        version: version,
        builds: builds,
    });
});