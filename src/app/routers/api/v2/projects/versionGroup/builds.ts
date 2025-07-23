import router from "../../../../../router";
import { parseAndValidatePathSecs } from "../../../../../utils/requestParser";
import { getProjectName } from "../../../../../utils/projectUtils";
import { getVersionGroupId, getVersionGroupVersions } from "../../../../../utils/versionGroupUtils";
import { getVersionsBuildsData } from "../../../../../utils/versionUtils";
import restUtils from "../../../../../utils/restUtils";
import { toBuild } from "../../../../../utils/buildUtils";

router.pattern(/^\/v2\/projects\/[^\/]+\/version_group\/[^\/]+\/builds\/?$/, async (request, response) => {
    const secs = parseAndValidatePathSecs(request, 6);
    const projectId = secs[2];
    const versionGroup = secs[4];

    const projectName = await getProjectName(projectId);
    const versionGroupId = await getVersionGroupId(projectId, versionGroup);
    const versions = await getVersionGroupVersions(projectId, versionGroupId);
    const buildsData = await getVersionsBuildsData(projectId, versions.ids);
    const builds = (await Promise.all(buildsData.map(it => toBuild(it))))
        .sort((a, b) => a.build - b.build);

    return restUtils.$200(response, {
        project_id: projectId,
        project_name: projectName,
        version_group: versionGroup,
        versions: versions.names,
        builds: builds,
    });
});