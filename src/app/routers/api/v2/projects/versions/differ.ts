import router from "../../../../../router";
import { parseAndValidatePathSecs } from "../../../../../utils/requestParser";
import { getVersionId, getVersionsLatestBuildId } from "../../../../../utils/versionUtils";
import { NotFound } from "../../../../../utils/restUtils";
import { db } from "../../../../../utils/db/db";

router.pattern(/^\/v2\/projects\/[^\/]+\/versions\/[^\/]+\/differ\/[^\/]+\/?$/, async (request, response) => {
    const secs = parseAndValidatePathSecs(request, 7);
    const projectId = secs[2];
    const versionName = secs[4];
    const versionRef = secs[6];


    const versionId = await getVersionId(projectId, versionName);
    const latestVersionBuildId = await getVersionsLatestBuildId(projectId, [versionId]);

    const changesResult = await db().query(
        "select id from changes where project = $1 and commit like $2",
        [projectId, `${versionRef}%`],
    );
    if (!changesResult.rowCount || changesResult.rowCount === 0) {
        throw new NotFound(`No changes found for version reference ${versionRef}`);
    } else if (changesResult.rowCount > 1) {
        throw new NotFound(`Multiple changes found for version reference prefix ${versionRef}. Please specify a more precise reference.`);
    }
    const changeId = changesResult.rows[0].id;

    const referredBuildIdResult = await db().query(
        "select build_id from builds where version = $1 and changes @> $2",
        [versionId, [changeId]],
    );
    const referredBuildId = referredBuildIdResult.rows[0].build_id;

    response.contentType = "text/plain";
    response.status = 200;
    response.response = latestVersionBuildId - referredBuildId;
});