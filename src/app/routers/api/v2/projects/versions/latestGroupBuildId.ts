import router from "../../../../../router.ts";
import { parseAndValidatePathSecs } from "../../../../../utils/requestParser.ts";
import { getVersionGroupId, getVersionId, getVersionsLatestBuildId } from "../../../../../utils/versionUtils.ts";
import { getVersionGroupVersions } from "../../../../../utils/versionGroupUtils.ts";

router.pattern(/^\/v2\/projects\/[^\/]+\/versions\/[^\/]+\/latestGroupBuildId\/?$/, async (request, response) => {
    const secs = parseAndValidatePathSecs(request, 6);
    const projectId = secs[2];
    const versionName = secs[4];

    const versionId = await getVersionId(projectId, versionName);
    const versionGroupId = await getVersionGroupId(versionId);
    const versions = await getVersionGroupVersions(projectId, versionGroupId);
    const latestBuildId = await getVersionsLatestBuildId(projectId, versions.ids);

    response.contentType = "text/plain";
    response.status = 200;
    response.response = latestBuildId;
});