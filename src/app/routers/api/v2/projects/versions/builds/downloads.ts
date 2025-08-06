import router from "../../../../../../router";
import { parseAndValidatePathSecs } from "../../../../../../utils/requestParser";
import { getBuildData, parseBuildId } from "../../../../../../utils/buildUtils";
import { getVersionId } from "../../../../../../utils/versionUtils";
import { getDownloadData } from "../../../../../../utils/downloadUtils";

router.pattern(/^\/v2\/projects\/[^\/]+\/versions\/[^\/]+\/builds\/[^\/]+\/downloads\/[^\/]+\/?$/, async (request, response) => {
    const secs = parseAndValidatePathSecs(request, 9);
    const projectId = secs[2];
    const versionName = secs[4];
    const downloadSource = secs[8];

    const versionId = await getVersionId(projectId, versionName);
    const buildId = await parseBuildId(projectId, versionId, secs[6]);
    const buildData = await getBuildData(projectId, versionId, buildId);
    const downloadData = await getDownloadData(downloadSource, buildData);

    response.status = 302;
    response.redirect = true;
    response.contentType = "application/java-archive";
    response.redirectUrl = downloadData.url;
});