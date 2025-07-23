import router from "../../../../../router";
import { parseAndValidatePathSecs } from "../../../../../utils/requestParser";
import { getProjectName } from "../../../../../utils/projectUtils";
import { getVersionBuildsData, getVersionId } from "../../../../../utils/versionUtils";
import restUtils from "../../../../../utils/restUtils";
import { toBuild } from "../../../../../utils/buildUtils";

router.pattern(/^\/v2\/projects\/[^\/]+\/versions\/[^\/]+\/builds\/?$/, async (request, response) => {
    const secs = parseAndValidatePathSecs(request, 5);
    const projectId = secs[2];
    const version = secs[4];

    const projectName = await getProjectName(projectId);
    const versionId = await getVersionId(projectId, version);
    const buildData = await getVersionBuildsData(projectId, versionId);
    const builds = (await Promise.all(buildData.map(it => toBuild(it))))
        .sort((a, b) => a.build - b.build);

    return restUtils.$200(response, {
        project_id: projectId,
        project_name: projectName,
        version: version,
        builds: builds,
    });
});